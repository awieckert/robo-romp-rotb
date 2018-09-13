import React, { Component } from 'react';
import userRequests from '../../firebaseRequests/userRequests.js';
import './LeaderBoard.css';
import '../../../node_modules/animate.css/animate.min.css';

class LeaderBoard extends Component {
  state = {
    spLeaderBoard: [],
    olLeaderBoard: [],
  };

  componentDidMount () {
    // When the component mounts grab the data for both leader boards from firebase and set components state with that data.
    Promise.all([userRequests.getUsersBySpWins(), userRequests.getUsersByOlWins()]).then((leaderBoards) => {
      this.setState({spLeaderBoard: leaderBoards[0]});
      this.setState({olLeaderBoard: leaderBoards[1]});
    });
  };

  render () {
    const spLeaders = [...this.state.spLeaderBoard];
    const olLeaders = [...this.state.olLeaderBoard];

    // Map over the single player leader board data, for each player determine their win pecentage, and return JSX required to display the info
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

    // Map over the online play leader board data, for each player determine their win pecentage, and return JSX required to display the info
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
