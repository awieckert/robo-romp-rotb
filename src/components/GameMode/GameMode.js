import React, { Component } from 'react';
import firebase from 'firebase';
import LeaderBoard from '../LeaderBoard/LeaderBoard.js';
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
  };

  toSinglePlayerSelectionScreen = () => {
    this.props.history.push('/selectionscreen');
    userRequests.getUser('Mackiller').then((computer) => {
      this.props.setEnemyProfile(computer);
    }).catch((err) => {
      console.error('Could not grab the computer profile from firebase: ', err);
    });
  }

  componentDidMount () {
    const currentUser = firebase.auth().currentUser;
    userRequests.getUser(currentUser.uid).then((activeUser) => {
      this.setState({userProfile: activeUser});
      this.props.setActiveUser(activeUser);
    }).catch((err) => {
      console.error('Could not grab current user from firebase: ', err);
    });
  };

  render () {
    return (
      <div className="GameMode">
        <h1 className="GameMode-title">GameMode</h1>
        <div className='row'>
          <div className='col-xs-6'>
            <div className='row'>
              <div className='col-xs-12'>
                <button className='btn btn-danger' onClick={this.toSinglePlayerSelectionScreen}>Single Player</button>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12'>
                <button className='btn btn-danger' onClick={this.toSelectionScreen} disabled>Online Game</button>
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
