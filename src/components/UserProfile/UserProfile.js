import React from 'react';
import userRequests from '../../firebaseRequests/userRequests.js';
import firebase from 'firebase';
import FavoriteBots from '../FavoriteBots/FavoriteBots.js';
import './UserProfile.css';

class UserProfile extends React.Component {
  state = {
    userProfile: {},
    sortedFavoriteBots: [],
  };

  deleteAccount = () => {
    const areYouSure = prompt('Are you sure you want to delete? If so type YES');
    if (areYouSure === 'YES') {
      userRequests.reallyDeleteTheAccount(this.state.userProfile.id).then(() => {
        const currentUser = firebase.auth().currentUser;
        currentUser.delete().then(() => {
          this.props.setAuthedFalse();
          this.props.history.push('/');
        }).catch((err) => {
          console.error('Could not delete the user from firebase: ', err);
        });
      }).catch((err) => {
        console.error('Failed to delete the user account');
      });
    }
  };

  toGameMode = () => {
    this.props.history.push('/gamemode');
  };

  componentWillMount () {
    const {userProfile} = {...this.props};
    const sortedFavoriteBots = [...this.props.sortedFavorites];
    this.setState({userProfile: userProfile, sortedFavoriteBots: sortedFavoriteBots});
  }

  componentDidMount () {

  };

  render () {
    const {userProfile} = {...this.props};
    const damage = userProfile.dmgDealt;
    return (
      <div className='UserProfile container'>
        <div className='row'>
          <button className='btn btn-primary' onClick={this.toGameMode}>Back</button>
          <div className='col-sm-12 text-center'>
            <h2>{userProfile.username}</h2>
            <h3>Single Player Stats</h3>
            <h4>Games Played: {userProfile.spGames}</h4>
            <h4>Wins: {userProfile.spWins}</h4>
            <h4>Loses: {userProfile.spLoses}</h4>
            <br/>
            <h3>Online Stats</h3>
            <h4>Games Played: {userProfile.olGames}</h4>
            <h4>Wins: {userProfile.olWins}</h4>
            <h4>Loses: {userProfile.olLoses}</h4>
            <br/>
            <h3>Career Stats</h3>
            <h4>Total Games Played: {userProfile.spGames + userProfile.olGames}</h4>
            <h4>Total Wins: {userProfile.spWins + userProfile.olWins}</h4>
            <h4>Total Damage Dealt: {damage.toFixed(1)}</h4>
            <br/>
            <FavoriteBots favoriteBots={this.state.sortedFavoriteBots} />
            <button className='btn btn-danger' onClick={this.deleteAccount}>Delete Account</button>
          </div>
        </div>

      </div>
    );
  };
};

export default UserProfile;
