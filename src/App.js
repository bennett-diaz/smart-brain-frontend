import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import FaceRegonition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';



const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onRouteChange = (route) => {
    if (route == 'signout') {
      this.setState(initialState)
      this.setState({ imageUrl: '' })
    } else if (route == 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  onButtonSubmit = () => {
    console.log('click')
    console.log('input:', this.state.input)
    this.setState({ imageUrl: this.state.input }, () => {
      console.log('imageUrl:', this.state.imageUrl);

      fetch('https://smart-brain-backend-a6vy.onrender.com/clarifai', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: this.state.imageUrl
        })
      })
        .then(response => response.json())
        .then(faceBox => {
          this.displayFaceBox(this.calculateFaceLocation(faceBox));
        })
        .catch(error => console.log('error', error));
      fetch('https://smart-brain-backend-a6vy.onrender.com/image', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
        .catch(error => console.log('error', error));
    });
  }




  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    let content;
    if (route === 'home') {
      content = (
        <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRegonition box={box} imageUrl={imageUrl} />
        </div>
      );
    } else if (route === 'signin') {
      content =
        <div>
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        </div>
    } else {
      content =
        <div>
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />;
        </div>
    }

    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {content}
      </div>
    );
  }
}

export default App;