import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import LeaderBoard from '../LeaderBoard/LeaderBoard.js';
import WinnerBot from '../WinnerBot/WinnerBot.js';
import './WinnerScreen.css';

class WinnerScreen extends Component {
  state = {
    spLeaderBoard: [],
  };

  sendToGameMode = () => {
    this.props.history.push('/gamemode');
  };

  componentDidMount () {

  };

  render () {
    return (
      <div className="WinnerScreen">
        <h1 className="WinnerScreen-title">WinnerScreen</h1>
        <div className='row'>
          <div className='col-xs-4 col-sm-offset-4'>
            <Button onClick={this.sendToGameMode}>Select Game Mode</Button>
          </div>
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
