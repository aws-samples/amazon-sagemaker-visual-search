import React from 'react';
import './App.css';
import 'typeface-roboto';
import { Button, Input, FormControl, Select, MenuItem, Link } from '@mui/material';
import { spacing } from "@mui/system";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
// import Amplify, { API } from "aws-amplify";
import '@aws-amplify/ui/dist/style.css';
// import Config from './config';

import Uppy from '@uppy/core';
import { DragDrop } from '@uppy/react';


// Amplify.configure({
//   API: {
//     endpoints: [
//       {
//         name: "ImageSearch",
//         endpoint: Config.apiEndpoint
//       }
//     ]
//   }
// });


class App extends React.Component {

  constructor(props) {
    super(props);
    this.uppy = new Uppy();

    this.state = {
      pictures: [],
      completed: 0,
      k: 3
    };
    // this.onDrop = this.onDrop.bind(this);
    // this.getBase64 = this.getBase64.bind(this);
    // this.getSimilarImages = this.getSimilarImages.bind(this);
    // this.handleURLSubmit = this.handleURLSubmit.bind(this);
    // this.handleFormChange = this.handleFormChange.bind(this);
    // this.handleKChange = this.handleKChange.bind(this);
  }

  componentWillMount() {
    this.uppy.close({ reason: 'unmount' });
  }

  // handleURLSubmit(event) {
  //   // function for when a use submits a URL
  //   // if the URL bar is empty, it will remove similar photos from state
  //   console.log(this.state.url);
  //   if (this.state.url === undefined || this.state.url === "") {
  //     console.log("Empty URL field");
  //     this.setState({ pictures: [], completed: 0 });
  //   } else {
  //     const myInit = {
  //       body: { "url": this.state.url, "k": this.state.k }
  //     };
  //     this.setState({ completed: 66 });
  //     API.post('ImageSearch', '/postURL', myInit)
  //       .then(response => {
  //         this.setState({
  //           pictures: response.images.map(function (elem) {
  //             let picture = {};
  //             picture.img = elem;
  //             picture.cols = 1;
  //             return picture;
  //           })
  //         });
  //         this.setState({ completed: 100 });
  //         console.log(this.state.pictures);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   };
  //   event.preventDefault();
  // }

  handleFormChange(event) {
    this.setState({ url: event.target.value });
  }

  handleKChange(event) {
    this.setState({ k: event.target.value });
  }


  // onDrop(pictureFiles, pictureDataURLs) {
  //   // function for when a user uploads a picture from the device
  //   // if they click the x box after uploading, it will remove
  //   // similar photos from the state
  //   if (pictureFiles[0] === undefined) {
  //     console.log("Image deleted...");
  //     this.setState({ pictures: [], completed: 0 });
  //   } else {
  //     this.setState({ completed: 33 });
  //     this.getBase64(pictureFiles[0], (result) => {
  //       console.log(result);
  //       this.getSimilarImages(result);
  //     });
  //   };
  // }

  // getBase64(file, cb) {
  //   // convert image to base64
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function () {
  //     cb(reader.result.replace(/^data:image\/[a-z]+;base64,/, ""));
  //   };
  //   reader.onerror = function (error) {
  //     console.log('Error: ', error);
  //   };
  // }

  // getSimilarImages(imgBase64) {
  //   const myInit = {
  //     body: { "base64img": imgBase64, "k": this.state.k }
  //   };
  //   this.setState({ completed: 66 });
  //   API.post('ImageSearch', '/postImage', myInit)
  //     .then(response => {
  //       this.setState({
  //         pictures: response.images.map(function (elem) {
  //           let picture = {};
  //           picture.img = elem;
  //           picture.cols = 1;
  //           return picture;
  //         })
  //       });
  //       this.setState({ completed: 100 });
  //       console.log(this.state.pictures);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     })
  // };

  render() {
    const classes = {
      paper: {
        padding: spacing(2),
        textAlign: 'center',
        backgroundColor: '#fafafa',
        height: '100%',
        width: '100%',
      },
      root: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }
    };

    return (
      <div style={classes.root}>

        <Grid container justifyContent='center' alignItems="stretch" spacing={8}>
          <Grid item xs={10}>
            <img src={require('./images/header.jpg')} alt="Header" style={{ height: "100%", width: "100%" }} />
          </Grid>
          <Grid item xs={10}>
            <Typography variant="h2" style={{ textAlign: "center" }}>
              AWS Visual Image Search
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <Paper style={classes.paper}>
              Step 1: Select the number of similar images (K neighbors):
              <p />
              <FormControl>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.k}
                  onChange={this.handleKChange}
                >
                  <MenuItem value={3}>Three</MenuItem>
                  <MenuItem value={4}>Four</MenuItem>
                  <MenuItem value={5}>Five</MenuItem>
                  <MenuItem value={6}>Six</MenuItem>
                </Select>
              </FormControl>
              <p />
            </Paper>
          </Grid>

          <Grid item xs={10}>
            <Paper style={classes.paper}>
              Step 2:<p />
              Provide an image to search against. Choose an image of a dress, like the one here from the Zolando dataset: <p />
              <Link
                href='https://i4.ztat.net/large/VE/12/1C/14/8K/12/VE121C148-K12@10.jpg'
                target="_blank"
                rel="noreferrer">
                https://i4.ztat.net/large/VE/12/1C/14/8K/12/VE121C148-K12@10.jpg
              </Link>
              <p />
            </Paper>
          </Grid>

          <Grid item xs={5}>
            <Paper style={classes.paper}>
              Upload an image from your device:
              <br />
              <br />
              <br />
              <DragDrop
                uppy={this.uppy}
                width={'33%'}
                // onDrop={this.onDrop}
                locale={{
                  strings: {
                    dropHereOr: 'Drop here or %{browse}',
                    browse: 'browse'
                  }

                }}
              >
              </DragDrop>
            </Paper>
          </Grid>
          <Grid item xs={5} >
            <Paper style={classes.paper}>
              or enter a publically accessable web URL of an image:

              <form noValidate autoComplete="off" onSubmit={this.handleURLSubmit}>
                <Input
                  onChange={this.handleFormChange}
                  value={this.state.url}
                  id="standard-basic"
                  margin="dense"
                  fullWidth
                />
                <p />
                <Button
                  type='submit'
                  variant="contained"
                >
                  Submit
                </Button>
              </form>
              <p />
            </Paper>
          </Grid>
          <Grid item xs={10}>
            <Paper style={classes.paper}>
              Step 3: Results!<p />
              <LinearProgress
                variant="determinate"
                color="secondary"
                value={this.state.completed}
              />
              <p />
              <ImageList rowHeight={200} cols={3}>
                {this.state.pictures.map((tile) => (
                  <ImageListItem key={tile.img} cols={tile.cols || 1}>
                    <img src={tile.img} alt="Similar photos..." style={{ height: "100%", width: "auto" }} />
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={10}>
          <p />
        </Grid>

      </div>
    );
  }
}

export default (App);

