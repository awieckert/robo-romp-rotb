import React, { Component } from 'react';
import {Route, BrowserRouter, Redirect, Switch}  from 'react-router-dom';
import firebase from 'firebase';
import firebaseConnection from '../firebaseRequests/connection.js';
import Home from '../components/Home/Home.js';
import Login from '../components/Login/Login.js';
import Register from '../components/Register/Register.js';
import GameMode from '../components/GameMode/GameMode.js';
import SelectionScreen from '../components/SelectionScreen/SelectionScreen.js';
import FightArena from '../components/FightArena/FightArena.js';
import WinnerScreen from '../components/WinnerScreen/WinnerScreen.js';
import './App.css';
firebaseConnection();

const PublicRoute = ({component: Component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to={{pathname: '/gamemode', state: {from: props.location}}} />
        )
      }
    />
  );
};

const PrivateRoute = ({component: Component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={{pathname: '/', state: {from: props.location}}} />
        )
      }
    />
  );
};

class App extends Component {
  state = {
    authed: false,
    userProfile: {},
    userRobot: {},
    enemyProfile: {},
    enemyRobot: {},
  }

  componentDidMount () {
    this.checkUserState = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({authed: true});
      } else {
        this.setState({authed: false});
      }
    });
  }

  componentWillUnmount () {
    this.checkUserState();
  }

  render () {
    return (
      <div className="App">
        <BrowserRouter>
          <div className='container-fluid main-container'>
            <Switch>
              <Route path='/' exact component={Home} />
              <PublicRoute path='/login' authed={this.state.authed} component={Login} />
              <PublicRoute path='/register' authed={this.state.authed} component={Register} />
              <PrivateRoute path='/gamemode' authed={this.state.authed} component={GameMode} />
              <PrivateRoute path='/selectionscreen' authed={this.state.authed} component={SelectionScreen}/>
              <PrivateRoute path='/fightarena' authed={this.state.authed} component={FightArena} />
              <PrivateRoute path='/winnerscreen' authed={this.state.authed} component={WinnerScreen}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
