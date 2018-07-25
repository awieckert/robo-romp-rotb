import React, { Component } from 'react';
// import userRequests from '../../firebaseRequests/userRequests.js';
import LeaderBoard from '../LeaderBoard/LeaderBoard.js';
import WinnerBot from '../WinnerBot/WinnerBot.js';
import './WinnerScreen.css';

class WinnerScreen extends Component {
  state = {
    spLeaderBoard: [],
  };

  componentDidMount () {
    // userRequests.getUsersBySpWins().then((leaders) => {
    //   this.setState({spLeaderBoard: leaders});
    // }).catch((err) => {
    //   console.error('Failed to get users by wins from firebase: ', err);
    // });
  };

  render () {
    return (
      <div className="WinnerScreen">
        <h1 className="WinnerScreen-title">WinnerScreen</h1>
        <div className='row'>
          <div className='col-xs-6'>
            <WinnerBot winnerBot={this.props.winnerBot} winnerProfile={this.props.winnerProfile}/>
          </div>
          <div className='col-xs-6'>
            <LeaderBoard />
          </div>
        </div>

      </div>
    );
  }
}

export default WinnerScreen;
