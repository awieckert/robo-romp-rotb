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
    // Sets flag for determining if game is online game or not
    this.setState({onlinePlay: true});
  };

  setCurrentOnlineMatch = (currentMatch) => {
    // Function that is passed throughout the application to make sure the currentOnlineMatch in App's state is always up to date
    this.setState({currentOnlineMatch: currentMatch});
  };

  setSortedFavorites = (sortedFavorites) => {
    // Sets App's state with the sorted favorite bots grabbed from firebase for the logged in user
    this.setState({sortedFavorites: sortedFavorites});
  };

  setFavoriteBots = (favorites) => {
    // Sets App's state with a list of all the bots and the number of times a user has used them. Used to update usage of a given bot later on.
    this.setState({favoriteBots: favorites});
  };

  setActiveUser = (activeUser) => {
    // Set current user profile in the apps state. Grabbed from firebase once logged in.
    this.setState({userProfile: activeUser});
  };

  setUserRobot = (robot) => {
    // Used to set the user selected robot in App's state
    this.setState({userRobot: robot});
  };

  setEnemyProfile = (enemyInfo) => {
    // used to set the enemy profile in apps state
    this.setState({enemyProfile: enemyInfo});
  };

  setEnemyRobot = (robot) => {
    // Used to set app's state with enemy selected robot
    this.setState({enemyRobot: robot});
  };

  setWinnerProfile = (winner) => {
    // Set the winning user profile in App's state, used to pass into the WinnerScreen component
    this.setState({winnerProfile: winner});
  };

  setWinnerBot = (bot) => {
    // Set the winning bot in the App's state, used to pass into the WinnerScreen component
    this.setState({winnerBot: bot});
  };

  setAuthedFalse = () => {
    // Used for a logging out a user, no routes except loggin are visible to the user when authed is false. Currently no log out button :)
    this.setState({authed: false});
  };

  componentDidMount () {
    // initializes the audio. Checks the firebase user state when the component mounts. Updates the App's authed state accordingly
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
    // Checks the firebase user state when the component unmounts.
    this.checkUserState();
  }

  render () {
    // Below are the base routes needed for the application. As you can see many attributes are passed to each route.
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
