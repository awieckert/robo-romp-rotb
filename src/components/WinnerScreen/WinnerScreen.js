import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import LeaderBoard from '../LeaderBoard/LeaderBoard.js';
import WinnerBot from '../WinnerBot/WinnerBot.js';
import WinningBots from '../WinningBots/WinningBots.js';
import UsedBots from '../UsedBots/UsedBots.js';
import robotRequests from '../../firebaseRequests/robotRequests.js';
import './WinnerScreen.css';

class WinnerScreen extends Component {
  state = {
    robotStats: {
      mostUsedBots: [],
      mostWinsBots: [],
    },
  };

  sendToGameMode = () => {
    this.props.history.push('/gamemode');
  };

  componentWillMount () {
    const robotStats = {...this.state.robotStats};
    Promise.all([robotRequests.getMostUsedBots(), robotRequests.getMostWinningBots()]).then((arrayOfUsedNWinningBots) => {
      robotStats.mostUsedBots = arrayOfUsedNWinningBots[0];
      robotStats.mostWinsBots = arrayOfUsedNWinningBots[1];
      this.setState({robotStats: robotStats});
    }).catch((err) => {
      console.error('Failed to get the used and winning robots: ', err);
    });
  };

  render () {
    return (
      <div className="WinnerScreen">
        <h1 className="WinnerScreen-title">WinnerScreen</h1>
        <div className='row'>
          <div className='col-xs-4 col-sm-offset-4'>
            <Button onClick={this.sendToGameMode}>Select Game Mode</Button>
          </div>
          <div className='col-xs-6 margin-top'>
            <WinnerBot winnerBot={this.props.winnerBot} winnerProfile={this.props.winnerProfile}/>
            <div className='col-xs-10 col-xs-offset-1 margin-top-more'>
              <UsedBots mostUsedBots={this.state.robotStats.mostUsedBots}/>
            </div>
            <div className='col-xs-10 col-xs-offset-1 margin-top'>
              <WinningBots winningBots={this.state.robotStats.mostWinsBots} />
            </div>
          </div>
          <div className='col-xs-6 margin-top'>
            <LeaderBoard />
          </div>
        </div>

      </div>
    );
  }
}

export default WinnerScreen;
