import React from 'react';
import './App.css';
import 'typeface-roboto';
import { Button, Input, FormControl, Select, MenuItem, Link } from '@material-ui/core';
import { withStyles, lighten } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import ImageUploader from "react-images-upload";
import Amplify, { API } from "aws-amplify";
import '@aws-amplify/ui/dist/style.css';
import Config from './config';


Amplify.configure({
  API: {
      endpoints: [
          {
              name: "ImageSearch",
              endpoint: Config.apiEndpoint
            }
      ]
  }
});

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    height: "100%",
    color: theme.palette.text.secondary
  },
});

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten('#ff6c5c', 0.5),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#ff6c5c',
  },
})(LinearProgress);

// const classes = useStyles();

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      completed:0,
      k:3
    };
    this.onDrop = this.onDrop.bind(this);
    this.getBase64 = this.getBase64.bind(this);
    this.getSimilarImages = this.getSimilarImages.bind(this);
    this.handleURLSubmit = this.handleURLSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleKChange = this.handleKChange.bind(this);
  }

  handleURLSubmit(event) {
    // function for when a use submits a URL
    // if the URL bar is empty, it will remove similar photos from state
    console.log(this.state.url);
    if (this.state.url === undefined || this.state.url === "") {
      console.log("Empty URL field");
      this.setState({pictures: [], completed:0});
    } else {
      const myInit = {
        body: {"url": this.state.url, "k": this.state.k}
      };
      this.setState({completed:66});
      API.post('ImageSearch', '/postURL', myInit)
      .then(response => {
        this.setState({pictures: response.images.map(function(elem) {
          let picture = {};
          picture.img = elem;
          picture.cols = 1;
          return picture;
        })
      }); 
      this.setState({completed:100});
      console.log(this.state.pictures);
      })
      .catch(error => {
        console.log(error);
      });
    };
    event.preventDefault();
  }

  handleFormChange(event) {
    this.setState({url: event.target.value});
  }

  handleKChange(event) {
    this.setState({k: event.target.value});
  }

  onDrop(pictureFiles, pictureDataURLs) {
    // function for when a user uploads a picture from the device
    // if they click the x box after uploading, it will remove
    // similar photos from the state
    if (pictureFiles[0] === undefined) {
      console.log("Image deleted...");
      this.setState({pictures: [], completed:0});
    } else {
      this.setState({completed:33});
      this.getBase64(pictureFiles[0], (result) => {
          console.log(result);
          this.getSimilarImages(result);
      });
    }; 
  }

  getBase64(file, cb) {
    // convert image to base64
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result.replace(/^data:image\/[a-z]+;base64,/, ""));
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  getSimilarImages(imgBase64) {
    const myInit = {
      body: {"base64img": imgBase64,"k": this.state.k}
    };
    this.setState({completed:66});
    API.post('ImageSearch', '/postImage', myInit)
    .then(response => {
      this.setState({pictures: response.images.map(function(elem) {
        let picture = {};
        picture.img = elem;
        picture.cols = 1;
        return picture;
      })
    }); 
    this.setState({completed:100});
    console.log(this.state.pictures);
    })
    .catch(error => {
      console.log(error);
    })
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>

        <Grid container justify='center' alignItems="stretch" spacing={8} xs={12}>
          <Grid item xs={10}>
            <img src={require('./images/header.jpg')} alt="Header" style={{height:"100%", width: "100%"}}/>
          </Grid>
          <Grid item xs={10}>
            <Typography variant="h2" style={{textAlign: "center"}}>
              AWS Visual Image Search
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <Paper className={classes.paper}>
              Step 1: Select the number of similar images (K neighbors):
              <p/>
              <FormControl className={classes.formControl}>
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
            </Paper>
          </Grid>

          <Grid item xs={10}>
            <Paper className={classes.paper}>
              Step 2:<p/>
              Provide an image to search against. Choose an image of a dress, like the one here from the Zolando dataset: <p/>
              <Link href='https://i4.ztat.net/large/VE/12/1C/14/8K/12/VE121C148-K12@10.jpg' target="_blank" rel="noreferrer">https://i4.ztat.net/large/VE/12/1C/14/8K/12/VE121C148-K12@10.jpg</Link>
            </Paper>
          </Grid>

          <Grid item xs={5}>
            <Paper className={classes.paper}>
              Upload an image from your device:
              <ImageUploader style={{borderStyle:"hidden"}}
                withIcon={true}
                buttonStyles={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color:"black", fontweight:"bold"}}
                buttonText="CHOOSE IMAGE"
                // className={classes.paper}
                onChange={this.onDrop}
                imgExtension={[".jpg", ".jpeg", ".gif", ".png", ".gif"]}
                maxFileSize={5242880}
                withPreview={true}
                singleImage={true}
              />
            </Paper>
          </Grid>
          <Grid item xs={5} >
            <Paper className={classes.paper} >
              or enter a publically accessable web URL of an image:
              <p/>
              <form noValidate autoComplete="off" onSubmit={this.handleURLSubmit}>
                <Input
                  onChange={this.handleFormChange}
                  value={this.state.url}
                  id="standard-basic"
                  margin="dense"
                  fullWidth
                />
                <Button
                type='submit'
                style={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}
                >
                  Submit
                </Button>
              </form>        
            </Paper>
          </Grid>
          <Grid item xs={10}>
              <Paper className={classes.paper}>
                Step 3: Results!<p/>
                <BorderLinearProgress
                    variant="determinate"
                    color="secondary"
                    value={this.state.completed}
                />
                <p/>
                <GridList cellHeight={200} className={classes.gridList} cols={3}>
                  {this.state.pictures.map((tile) => (
                    <GridListTile key={tile.img} cols={tile.cols || 1}>
                      <img src={tile.img} alt="Similar photos..." style={{height:"100%", width: "auto"}} />
                    </GridListTile>
                  ))}
                </GridList>
              </Paper>
            </Grid>
        </Grid>

        <Grid container justify="center">
          
        </Grid>

      </div>
  );}
}

export default withStyles(styles, { withTheme: true })(App);

