import React from 'react';
import onlineMatchRequests from '../../firebaseRequests/onlineMatchRequests.js';
import './OnlineMatches.css';
import '../../../node_modules/animate.css/animate.min.css';

class OnlineMatches extends React.Component {
  state = {
    onlineMatches: [],
  };

  joinGame = (e) => {
    // Function called after Create Online Game button is clicked.
    const gameToTarget = e.target.id;
    const {userProfile} = {...this.props};

    // Get all online matches from firebase, find the match with same ID as the match user selected to join. Add the users profile to this match as "enemyProfile", effectively user2.
    onlineMatchRequests.getOnlineMatches().then((allOnlineMatches) => {
      let matchToJoin = {};
      allOnlineMatches.forEach((match) => {
        if (match.id === gameToTarget) {
          match.enemyProfile = userProfile;
          matchToJoin = match;
        }
      });

      // Update the firebase online game object with the new user profile that was just added to it above. Set state of App with the most recent online game object. Then send the user to the selection screen
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

  render () {
    // All online matches are passed to component from Game Mode, when rendered map over all online games and create the necessary JSX to be rendered.
    const matchesToMap = [...this.props.onlineMatches];
    const onlineMatches = matchesToMap.map((match, i) => {
      return (
        <div key={match.id} id={match.id} className="panel-body flex-body">
          <div className='match'>Match {i + 1}</div>
          <div className='challenger'>Challenger: {match.userProfile.username}</div>
          <button className='bttn-unite bttn-md bttn-warning bttn-no-outline' id={match.id} onClick={this.joinGame}>Join Game</button>
        </div>
      );
    });
    return (
      <div className="OnlineMatches col-xs-12 animated fadeIn delay-1s">
        <div className="panel panel-default">
          <div className="panel-heading flex-header">
            <h3 className="panel-title">Online Matches</h3>
          </div>
          {onlineMatches}
        </div>
      </div>
    );
  };
};

export default OnlineMatches;
