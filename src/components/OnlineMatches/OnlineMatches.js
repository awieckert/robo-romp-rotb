import React from 'react';
import onlineMatchRequests from '../../firebaseRequests/onlineMatchRequests.js';
import './OnlineMatches.css';

class OnlineMatches extends React.Component {
  state = {
    onlineMatches: [],
  };

  joinGame = (e) => {
    const gameToTarget = e.target.id;
    const {userProfile} = {...this.props};
    onlineMatchRequests.getOnlineMatches().then((allOnlineMatches) => {
      let matchToJoin = {};
      allOnlineMatches.forEach((match) => {
        if (match.id === gameToTarget) {
          match.enemyProfile = userProfile;
          matchToJoin = match;
        }
      });
      onlineMatchRequests.joinGame(gameToTarget, matchToJoin).then(() => {
        this.props.setCurrentOnlineMatch(matchToJoin);
        this.props.setOnlinePlay();
        this.props.history.push('/selectionscreen');
      }).catch((err) => {
        console.error('Failed to join the game: ', err);
      });
    }).catch((err) => {
      console.error('Failed to get all online matches: ', err);
    });
  };

  // componentDidUpdate () {
  //   const onlineMatches = [...this.props.onlineMatches];
  //   this.setState({onlineMatches: onlineMatches});
  // };

  render () {
    const matchesToMap = [...this.props.onlineMatches];
    const onlineMatches = matchesToMap.map((match, i) => {
      return (
        <div key={match.id} id={match.id} className="panel-body">
          <div className='col-xs-2'>Match {i + 1}</div>
          <div className='col-xs-2'>Challenger: {match.userProfile.username}</div>
          <button className='btn btn-danger' id={match.id} onClick={this.joinGame}>Join Game</button>
        </div>
      );
    });
    return (
      <div className="LeaderBoard">
        <div className="panel panel-default">
          <div className="panel-heading flex-header">
            <h3 className="panel-title">Single Player Champions</h3>
          </div>
          {onlineMatches}
        </div>
      </div>
    );
  };
};

export default OnlineMatches;
