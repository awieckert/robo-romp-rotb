import React, { Component } from 'react';
import firebase from 'firebase';
import LeaderBoard from '../LeaderBoard/LeaderBoard.js';
import userRequests from '../../firebaseRequests/userRequests.js';
import onlineMatchRequests from '../../firebaseRequests/onlineMatchRequests.js';
import './GameMode.css';
import favoriteRequests from '../../firebaseRequests/favoriteRequests.js';
import OnlineMatches from '../OnlineMatches/OnlineMatches.js';

class GameMode extends Component {
  state = {
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
    onlineMatches: [],
    currentMatch: {},
  };

  createOnlineMatch = () => {
    // Creates an object with the necessary place-holder fields for the online play game. Sends this information to firebase
    const {userProfile} = {...this.state};
    const gameObject = {
      userProfile: userProfile,
      enemyProfile: {
        placeHolder: 0,
      },
      userRobot: {
        placeHolder: 0,
      },
      enemyRobot: {
        placeHolder: 0,
      },
      userStaticRobot: {
        placeHolder: 0,
      },
      enemyStaticRobot: {
        placeHolder: 0,
      },
      turn: 'user',
      isCritical: false,
      evaded: false,
      attacking: false,
      online: true,
      specialUsed: false,
    };
    // In order to create an online game object with the unique identifier on it right away, need to create the online match in firebase, GET all online match from firebase, add the firebase unique id to each match, filter for the online match just created and then lastly update the new online game object in firebase with the online game object that possesses the unique ID on it as a property value.
    onlineMatchRequests.createOnlineMatch(gameObject).then((uniqueId) => {
      onlineMatchRequests.getOnlineMatches().then((onlineMatches) => {
        const onlineGameObject = onlineMatches.find((x) => {
          return x.id === uniqueId.data.name;
        });
        onlineMatchRequests.updateOnlineGame(onlineGameObject.id, onlineGameObject).then(() => {
          // Set's client side state with most current online game object, set's state of app to online and sends user to selection screen.
          this.props.setCurrentOnlineMatch(onlineGameObject);
          this.props.setOnlinePlay();
          this.setState({onlineMatches: onlineMatches});
          this.props.history.push('/selectionscreen');
        }).catch((err) => {
          console.log('Failed to update created game with unique ID: ', err);
        });
      }).catch((err) => {
        console.error('Failed to get online matches from firebase: ', err);
      });
    }).catch((err) => {
      console.error('Failed to create online match in firebase: ', err);
    });
  };

  toSinglePlayerSelectionScreen = () => {
    // Function is called after single player mode is selected. Pushes user to the selection screen and sets the enemy Profile with the CPU profile from firebase.
    this.props.history.push('/selectionscreen');
    userRequests.getUser('Mackiller').then((computer) => {
      this.props.setEnemyProfile(computer);
    }).catch((err) => {
      console.error('Could not grab the computer profile from firebase: ', err);
    });
  }

  toUserProfile = () => {
    // Sends user to the user profile component when the user profile button is clicked
    this.props.history.push('/userprofile');
  };

  componentDidMount () {
    // When the component mounts, count down audio is paused in case user is coming back to game mode screen from the winner screen. Starts the background audio
    this.props.pauseCountDownAudio();
    const {backgroundAudio} = {...this.props};
    backgroundAudio.play();

    const currentUser = firebase.auth().currentUser.uid;

    // Promise.all grabs the current user profile, their favorite bot collection, their sorted favorite bot collection and all the online matches available. Set's the app's state accordingly.
    Promise.all([userRequests.getUser(currentUser), favoriteRequests.getUserFavorites(currentUser), favoriteRequests.getUserSortedFavorites(currentUser), onlineMatchRequests.getOnlineMatches()]).then((userInfoArray) => {
      this.props.setActiveUser(userInfoArray[0]);
      this.props.setFavoriteBots(userInfoArray[1]);
      this.props.setSortedFavorites(userInfoArray[2]);
      this.setState({userProfile: userInfoArray[0], onlineMatches: userInfoArray[3]});
    }).catch((err) => {
      console.error('Failed to get all user info and online matches form firebase: ', err);
    });

  };

  render () {
    return (
      <div className="GameMode">
        <div className='user-profile-bttn'>
          <button className='bttn-unite bttn-md bttn-primary bttn-no-outline' onClick={this.toUserProfile}>User Profile</button>
        </div>

        <div className='flex-title'>
          <h1 className="GameMode-title">Game Mode</h1>
        </div>

        <div className='row'>
          <div className='col-xs-6'>
            <div className='flex-row'>
              <div className='flex-column col-xs-12'>
                <div className='col-xs-12'>
                  <button className='bttn-unite bttn-md bttn-danger bttn-no-outline button-container' onClick={this.toSinglePlayerSelectionScreen}>Single Player Game</button>
                </div>
                <h2>Or</h2>
                <div className='col-xs-12 vertical-align-online'>
                  <button className='bttn-unite bttn-md bttn-danger bttn-no-outline button-container' onClick={this.createOnlineMatch}>Create Online Game</button>
                </div>
                <OnlineMatches history={this.props.history} setCurrentOnlineMatch={this.props.setCurrentOnlineMatch} userProfile={this.state.userProfile} onlineMatches={this.state.onlineMatches} setOnlinePlay={this.props.setOnlinePlay}/>
              </div>
            </div>
          </div>
          <div className='col-xs-6'>
            <h2>Leader Boards</h2>
            <LeaderBoard />
          </div>
        </div>
      </div>
    );
  }
}

export default GameMode;
