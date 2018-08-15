import React, { Component } from 'react';
import userRequests from '../../firebaseRequests/userRequests.js';
import './LeaderBoard.css';
import '../../../node_modules/animate.css/animate.css';

class LeaderBoard extends Component {
  state = {
    spLeaderBoard: [],
    olLeaderBoard: [],
  };

  componentWillUnmount () {
    console.log('Leaderboard unmounted, need this console maybe?');
  }

  componentDidMount () {
    console.log('Leaderboard mounted on win screen');
    Promise.all([userRequests.getUsersBySpWins(), userRequests.getUsersByOlWins()]).then((leaderBoards) => {
      this.setState({spLeaderBoard: leaderBoards[0]});
      this.setState({olLeaderBoard: leaderBoards[1]});
      console.log('Leaderboard promise finished');
    });
  };

  render () {
    const spLeaders = [...this.state.spLeaderBoard];
    const olLeaders = [...this.state.olLeaderBoard];

    const spLeaderBoard = spLeaders.map((player) => {
      let percentage = (player.spWins / player.spGames) * 100;
      if (isNaN(percentage)) {
        percentage = 0;
      }
      return (
        <div key={player.id} data-id={player.id} className="panel-body flex-panel">
          <div className='flex-user'>{player.username}</div>
          <div className='flex-wins'>{player.spWins}</div>
          <div className='flex-percent'>{percentage.toFixed(1)}%</div>
        </div>
      );
    });

    const olLeaderBoard = olLeaders.map((player) => {
      let percentage = (player.olWins / player.olGames) * 100;
      if (isNaN(percentage)) {
        percentage = 0;
      }
      return (
        <div key={player.id} data-id={player.id} className="panel-body flex-panel">
          <div className='flex-user'>{player.username}</div>
          <div className='flex-wins'>{player.olWins}</div>
          <div className='flex-percent'>{percentage.toFixed(1)}%</div>
        </div>
      );
    });

    return (
      <div>
        <div className="LeaderBoard animated bounceInDown">
          <div className="panel panel-default">
            <div className="panel-heading flex-header">
              <h3 className="panel-title">Single Player Champions</h3>
              <div className='header-wins'>
                <h5>Wins</h5>
              </div>
              <div className='header-percent'>
                <h5>Win %</h5>
              </div>
            </div>
            {spLeaderBoard}
          </div>
        </div>
        <div className="LeaderBoard animated bounceInUp">
          <div className="panel panel-default">
            <div className="panel-heading flex-header">
              <h3 className="panel-title">Online Play Champions</h3>
              <div className='header-wins'>
                <h5>Wins</h5>
              </div>
              <div className='header-percent'>
                <h5>Win %</h5>
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
