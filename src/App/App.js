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

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
};

const PublicRoute = ({component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          renderMergedProps(component, props, rest)
        ) : (
          <Redirect to={{pathname: '/gamemode', state: {from: props.location}}} />
        )
      }
    />
  );
};

const PrivateRoute = ({component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          renderMergedProps(component, props, rest)
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
    userProfile: {
      email: '',
      username: '',
      uid: '',
      spWins: 0,
      spLoses: 0,
      olWins: 0,
      olLoses: 0,
      spGames: 0,
      olGames: 0,
      charUnlock1: false,
      charUnlock2: false,
      dmgDealt: 0,
    },
    userRobot: {},
    enemyProfile: {},
    enemyRobot: {},
    winnerProfile: {},
    winnerBot: {},
  }

  setActiveUser = (activeUser) => {
    this.setState({userProfile: activeUser});
  };

  setUserRobot = (robot) => {
    this.setState({userRobot: robot});
  };

  setEnemyProfile = (enemyInfo) => {
    this.setState({enemyProfile: enemyInfo});
  };

  setEnemyRobot = (robot) => {
    this.setState({enemyRobot: robot});
  };

  setWinnerProfile = (winner) => {
    this.setState({winnerProfile: winner});
  };

  setWinnerBot = (bot) => {
    this.setState({winnerBot: bot});
  };

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
              <Route path='/' exact render={(props) => <Home {...props} />} />
              <PublicRoute path='/login' authed={this.state.authed} component={Login} />
              <PublicRoute path='/register' authed={this.state.authed} component={Register} />
              <PrivateRoute path='/gamemode' authed={this.state.authed} component={GameMode} setActiveUser={this.setActiveUser} setEnemyProfile={this.setEnemyProfile} />
              <PrivateRoute path='/selectionscreen' authed={this.state.authed} component={SelectionScreen} activeUser={this.state.userProfile} setUserRobot={this.setUserRobot} setEnemyProfile={this.setEnemyProfile} setEnemyRobot={this.setEnemyRobot}/>
              <PrivateRoute path='/fightarena' authed={this.state.authed} component={FightArena} enemyRobot={this.state.enemyRobot} userRobot={this.state.userRobot} userProfile={this.state.userProfile} enemyProfile={this.state.enemyProfile} setWinnerProfile={this.setWinnerProfile}setWinnerBot={this.setWinnerBot} />
              <PrivateRoute path='/winnerscreen' authed={this.state.authed} component={WinnerScreen} winnerBot={this.state.winnerBot} winnerProfile={this.state.winnerProfile}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
