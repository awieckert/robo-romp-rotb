import React, { Component } from 'react';
import firebase from 'firebase';
import LeaderBoard from '../LeaderBoard/LeaderBoard.js';
import userRequests from '../../firebaseRequests/userRequests.js';
import onlineMatchRequests from '../../firebaseRequests/onlineMatchRequests.js';
import './GameMode.css';
import favoriteRequests from '../../firebaseRequests/favoriteRequests.js';
import OnlineMatches from '../OnlineMatches/OnlineMatches.js';

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
    onlineMatches: [],
    currentMatch: {},
  };

  createOnlineMatch = () => {
    const {userProfile} = {...this.state};
    const gameObject = {
      userProfile: userProfile,
      enemyProfile: {
        placeHolder: 0,
      },
      userRobot: {
        placeHolder: 0,
      },
      enemyRobot: {
        placeHolder: 0,
      },
      userStaticRobot: {
        placeHolder: 0,
      },
      enemyStaticRobot: {
        placeHolder: 0,
      },
      turn: 'user',
      isCritical: false,
      evaded: false,
      attacking: false,
      online: true,
    };
    onlineMatchRequests.createOnlineMatch(gameObject).then(() => {
      onlineMatchRequests.getOnlineMatches().then((onlineMatches) => {
        this.setState({onlineMatches: onlineMatches});
        this.props.setCurrentOnlineMatch(gameObject);
        this.props.setOnlinePlay();
        this.props.history.push('/selectionscreen');
      }).catch((err) => {
        console.error('Failed to get online matches from firebase: ', err);
      });
    }).catch((err) => {
      console.error('Failed to create online match in firebase: ', err);
    });
  };

  toSinglePlayerSelectionScreen = () => {
    this.props.history.push('/selectionscreen');
    userRequests.getUser('Mackiller').then((computer) => {
      this.props.setEnemyProfile(computer);
    }).catch((err) => {
      console.error('Could not grab the computer profile from firebase: ', err);
    });
  }

  toUserProfile = () => {
    this.props.history.push('/userprofile');
  };

  componentDidMount () {
    const currentUser = firebase.auth().currentUser.uid;

    Promise.all([userRequests.getUser(currentUser), favoriteRequests.getUserFavorites(currentUser), favoriteRequests.getUserSortedFavorites(currentUser), onlineMatchRequests.getOnlineMatches()]).then((userInfoArray) => {
      this.props.setActiveUser(userInfoArray[0]);
      this.props.setFavoriteBots(userInfoArray[1]);
      this.props.setSortedFavorites(userInfoArray[2]);
      this.setState({userProfile: userInfoArray[0], onlineMatches: userInfoArray[3]});
    }).catch((err) => {
      console.error('Failed to get all user info and online matches form firebase: ', err);
    });

    // userRequests.getUser(currentUser).then((activeUser) => {
    //   this.setState({userProfile: activeUser});
    //   this.props.setActiveUser(activeUser);
    //   favoriteRequests.getUserFavorites(currentUser).then((favorites) => {
    //     this.props.setFavoriteBots(favorites);
    //     favoriteRequests.getUserSortedFavorites(currentUser).then((sortedFavorites) => {
    //       this.props.setSortedFavorites(sortedFavorites);
    //       onlineMatchRequests.getOnlineMatches().then((allMatches) => {
    //         this.setState({onlineMatches: allMatches});
    //       }).catch((err) => {
    //         console.error('Failed to get all the online matches from firebase: ', err);
    //       });
    //     }).catch((err) => {
    //       console.error('Could not get the sorted favorites from firebase: ', err);
    //     });
    //   }).catch((err) => {
    //     console.error('Unable to get favorites from firebase: ', err);
    //   });
    // }).catch((err) => {
    //   console.error('Could not grab current user from firebase: ', err);
    // });
  };

  render () {
    return (
      <div className="GameMode">
        <h1 className="GameMode-title">GameMode</h1>
        <div>
          <button className='btn btn-primary' onClick={this.toUserProfile}>User Profile</button>
        </div>
        <div className='row'>
          <div className='col-xs-6'>
            <div className='row'>
              <div className='col-xs-12 button-container'>
                <button className='btn btn-danger' onClick={this.toSinglePlayerSelectionScreen}>Single Player</button>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12'>
                <button className='btn btn-danger button-container' onClick={this.createOnlineMatch}>Create Online Match</button>
              </div>
            </div>
            <OnlineMatches history={this.props.history} setCurrentOnlineMatch={this.props.setCurrentOnlineMatch} userProfile={this.state.userProfile} onlineMatches={this.state.onlineMatches} setOnlinePlay={this.props.setOnlinePlay}/>
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
