import React, { Component } from 'react';
import firebase from 'firebase';
import userRequests from '../../firebaseRequests/userRequests.js';
import './GameMode.css';

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
    spLeaderBoard: {},
    olLeaderBoard: {},
  };

  componentDidMount () {
    const currentUser = firebase.auth().currentUser;
    const mainRef = firebase.database().ref('robo-romp-rotb');
    const usersRef = mainRef.child('users');
    usersRef.orderByChild('spWins').on('child_added', function (snap) {
      console.log(snap.val());
    });
    // console.error('leaders: ', leaders);
    userRequests.getUser(currentUser.uid).then((activeUser) => {
      this.setState({userProfile: activeUser});
      this.props.setActiveUser(activeUser);
    }).catch((err) => {
      console.error('Could not grab current user from firebase: ', err);
    });
    // call firebase grab user account
    // Set GameMode state with user info from fire base
    // Set app state with the most current user info from GameMode state -- pass in a setState function from App
    // get all info user info from firebase by spWins
    // Filter by most first
    // set leaderboard in state
    // Generate leaderboard component from state
  };

  render () {
    // const activeUser = this.props.setActiveUser;
    // console.error(activeUser);
    // this.props.setActiveUser(activeUser);
    return (
      <div className="GameMode">
        <h1 className="GameMode-title">GameMode</h1>
      </div>
    );
  }
}

export default GameMode;
