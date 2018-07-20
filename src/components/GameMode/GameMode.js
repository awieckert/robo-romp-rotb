import React, { Component } from 'react';
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
    // call firebase grab user account
    // Set GameMode state with user info from fire base
    // Set app state with the most current user info from GameMode state -- pass in a setState function from App
    // get all info user info from firebase by spWins
    // Filter by most first
    // set leaderboard in state
    // Generate leaderboard component from state
  };

  render () {
    return (
      <div className="GameMode">
        <h1 className="GameMode-title">GameMode</h1>
      </div>
    );
  }
}

export default GameMode;
