import React, { Component } from 'react';
import userRequests from '../../firebaseRequests/userRequests.js';
import './LeaderBoard.css';

class LeaderBoard extends Component {
  state = {
    spLeaderBoard: [],
    olLeaderBoard: [],
  };

  componentDidMount () {
    Promise.all([userRequests.getUsersBySpWins(), userRequests.getUsersByOlWins()]).then((leaderBoards) => {
      this.setState({spLeaderBoard: leaderBoards[0]});
      this.setState({olLeaderBoard: leaderBoards[1]});
    });
  };

  render () {
    const spLeaders = [...this.state.spLeaderBoard];
    const olLeaders = [...this.state.olLeaderBoard];

    const spLeaderBoard = spLeaders.map((player) => {
      const percentage = (player.spWins / player.spGames) * 100;
      return (
        <div className="panel-body">
          <div className='col-xs-2'>{player.username}</div>
          <div className='col-xs-2'>{player.spWins}</div>
          <div className='col-xs-2'>{percentage.toFixed(1)}%</div>
        </div>
      );
    });

    const olLeaderBoard = olLeaders.map((player) => {
      const percentage = (player.olWins / player.olGames) * 100;
      return (
        <div className="panel-body">
          <div className='col-xs-2'>{player.username}</div>
          <div className='col-xs-2'>{player.olWins}</div>
          <div className='col-xs-2'>{percentage.toFixed(1)}%</div>
        </div>
      );
    });

    return (
      <div>
        <div className="LeaderBoard">
          <div className="panel panel-default">
            <div className="panel-heading flex-header">
              <h3 className="panel-title">Single Player Champions</h3>
              <div className=''>
                <h5 className='header-line'>Wins</h5>
              </div>
              <div>
                <h5 className='header=line'>Win %</h5>
              </div>
            </div>
            {spLeaderBoard}
          </div>
        </div>
        <div className="LeaderBoard">
          <div className="panel panel-default">
            <div className="panel-heading flex-header">
              <h3 className="panel-title">Single Player Champions</h3>
              <div className=''>
                <h5 className='header-line'>Wins</h5>
              </div>
              <div>
                <h5 className='header=line'>Win %</h5>
              </div>
            </div>
            {olLeaderBoard}
          </div>
        </div>
      </div>
    );
  }
}

export default LeaderBoard;
