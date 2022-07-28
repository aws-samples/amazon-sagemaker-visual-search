import base64
import json
from os import environ

import boto3
import requests
from urllib.parse import urlparse
from io import BytesIO

# from elasticsearch import Elasticsearch, RequestsHttpConnection
from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth

# Global variables that are reused
sm_runtime_client = boto3.client("sagemaker-runtime")
s3_client = boto3.client("s3")


def get_features(sm_runtime_client, sagemaker_endpoint, img_bytes):
    response = sm_runtime_client.invoke_endpoint(
        EndpointName=sagemaker_endpoint,
        ContentType="application/x-image",
        Body=img_bytes,
    )
    response_body = json.loads((response["Body"].read()))
    features = response_body["predictions"][0]

    return features


def get_neighbors(features, oss, k_neighbors=3):
    idx_name = "idx_zalando"
    query = {
        "size": k_neighbors,
        "query": {
            "knn": {"zalando_img_vector": {"vector": features, "k": k_neighbors}}
        },
    }
    res = oss.search(request_timeout=30, index=idx_name, body=query)
    s3_uris = [res["hits"]["hits"][x]["_source"]["image"] for x in range(k_neighbors)]

    return s3_uris


def generate_presigned_urls(s3_uris):
    bucket = s3_uris[0].replace("s3://", "").split("/")[0]
    presigned_urls = [
        s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": x.replace(f"s3://{bucket}/", "")},
            ExpiresIn=300,
        )
        for x in s3_uris
    ]

    return presigned_urls


def download_file(url):
    r = requests.get(url)
    if r.status_code == 200:
        file = BytesIO(r.content)
    else:
        print("file failed to download")
    return file


def lambda_handler(event, _):
    region = environ["AWS_REGION"]
    elasticsearch_endpoint = environ["ES_ENDPOINT"]

    credentials = boto3.Session().get_credentials()
    awsauth = AWSV4SignerAuth(credentials, region)

    oss = OpenSearch(
        hosts=[{"host": elasticsearch_endpoint, "port": 443}],
        http_auth=awsauth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection,
    )

    # sagemaker variables
    sagemaker_endpoint = environ["SM_ENDPOINT"]

    api_payload = json.loads(event["body"])
    k = api_payload["k"]
    if event["path"] == "/postURL":
        image = download_file(api_payload["url"])
    else:
        img_string = api_payload["base64img"]
        print(img_string)
        image = BytesIO(base64.b64decode(img_string))

    features = get_features(sm_runtime_client, sagemaker_endpoint, image)
    s3_uris_neighbors = get_neighbors(features, oss, k_neighbors=k)
    s3_presigned_urls = generate_presigned_urls(s3_uris_neighbors)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
        },
        "body": json.dumps(
            {
                "images": s3_presigned_urls,
            }
        ),
    }
