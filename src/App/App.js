import React, { Component } from 'react';
import {Route, BrowserRouter, Redirect, Switch}  from 'react-router-dom';
import firebase from 'firebase';
import firebaseConnection from '../firebaseRequests/connection.js';
import Home from '../components/Home/Home.js';
import GameMode from '../components/GameMode/GameMode.js';
import SelectionScreen from '../components/SelectionScreen/SelectionScreen.js';
import FightArena from '../components/FightArena/FightArena.js';
import WinnerScreen from '../components/WinnerScreen/WinnerScreen.js';
import UserProfile from '../components/UserProfile/UserProfile.js';
import './App.css';
// This is a comment is to identify that my MVP is done, and that this branch can be rolled back to
firebaseConnection();

const renderMergedProps = (component, ...rest) => {
  // Returns a react element of the component being passed and well as the rest of the attributes/props being passed to the specific route
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
};

const PrivateRoute = ({component, authed, ...rest}) => {
  // Returns a Route component with the passed in attributes as props IF authed is true
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
    favoriteBots: {},
    sortedFavorites: [],
    currentOnlineMatch: {},
    onlinePlay: false,
    backgroundAudio: {},
    countDownAudio: {},
  }

  pauseCountDownAudio = () => {
    // Function to pause the count down/ fight song. Need to recreate new instance of the song in state because, setCurrentTime = 0 will not work with how React stores the HTML element in state
    this.state.countDownAudio.pause();
    const audioUrl = '../../audio/countDownAndFight.mp3';
    const newCountDown = new Audio(audioUrl);
    this.setState({countDownAudio: newCountDown});
  };

  pauseBackgroundAudio = () => {
    // Pause the original background music, not reacting a new instance of it because I do not want it to start over. It is long enough.
    this.state.backgroundAudio.pause();
  };

  setOnlinePlay = () => {
    this.setState({onlinePlay: true});
  };

  setCurrentOnlineMatch = (currentMatch) => {
    this.setState({currentOnlineMatch: currentMatch});
  };

  setSortedFavorites = (sortedFavorites) => {
    this.setState({sortedFavorites: sortedFavorites});
  };

  setFavoriteBots = (favorites) => {
    this.setState({favoriteBots: favorites});
  };

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

  setAuthedFalse = () => {
    this.setState({authed: false});
  };

  componentDidMount () {
    const backgroundMusicUrl = '../../audio/transformersBackground.mp3';
    const backgroundAudio = new Audio(backgroundMusicUrl);
    const countDownAudio = '../../audio/countDownAndFight.mp3';
    const countDown = new Audio(countDownAudio);
    this.checkUserState = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({authed: true, backgroundAudio: backgroundAudio, countDownAudio: countDown});
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
              <PrivateRoute path='/gamemode' authed={this.state.authed} component={GameMode} setFavoriteBots={this.setFavoriteBots} setActiveUser={this.setActiveUser} setEnemyProfile={this.setEnemyProfile} setSortedFavorites={this.setSortedFavorites} setCurrentOnlineMatch={this.setCurrentOnlineMatch} setOnlinePlay={this.setOnlinePlay} backgroundAudio={this.state.backgroundAudio} pauseCountDownAudio={this.pauseCountDownAudio}/>
              <PrivateRoute path='/selectionscreen' authed={this.state.authed} component={SelectionScreen} activeUser={this.state.userProfile} setUserRobot={this.setUserRobot} setEnemyProfile={this.setEnemyProfile} setEnemyRobot={this.setEnemyRobot} favoriteBots={this.state.favoriteBots} onlinePlay={this.state.onlinePlay} currentOnlineMatch={this.state.currentOnlineMatch} setCurrentOnlineMatch={this.setCurrentOnlineMatch} pauseBackgroundAudio={this.pauseBackgroundAudio} countDownAudio={this.state.countDownAudio}/>
              <PrivateRoute path='/fightarena' authed={this.state.authed} component={FightArena} enemyRobot={this.state.enemyRobot} userRobot={this.state.userRobot} userProfile={this.state.userProfile} enemyProfile={this.state.enemyProfile} setWinnerProfile={this.setWinnerProfile} setWinnerBot={this.setWinnerBot} onlinePlay={this.state.onlinePlay} currentOnlineMatch={this.state.currentOnlineMatch} />
              <PrivateRoute path='/winnerscreen' authed={this.state.authed} component={WinnerScreen} winnerBot={this.state.winnerBot} winnerProfile={this.state.winnerProfile}/>
              <PrivateRoute path='/userprofile' authed={this.state.authed} component={UserProfile} userProfile={this.state.userProfile} setAuthedFalse={this.setAuthedFalse} sortedFavorites={this.state.sortedFavorites} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
