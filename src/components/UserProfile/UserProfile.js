import React from 'react';
import userRequests from '../../firebaseRequests/userRequests.js';
import firebase from 'firebase';
import FavoriteBots from '../FavoriteBots/FavoriteBots.js';
import './UserProfile.css';
import '../../../node_modules/animate.css/animate.min.css';

class UserProfile extends React.Component {
  state = {
    userProfile: {},
    sortedFavoriteBots: [],
  };

  deleteAccount = () => {
    // When delete account button is clicked. Requires user to confirm with a prompt. Deletes user from firebase completely and pushes them back to the home page after setting the authed state of App to false.
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
    // Function called when the Back button is clicked. Sends th user back to the Game Mode screen.
    this.props.history.push('/gamemode');
  };

  componentWillMount () {
    // When the component mounts it sets it's own state with sorted bot information passed down to it from App's state.
    const sortedFavoriteBots = [...this.props.sortedFavorites];
    this.setState({sortedFavoriteBots: sortedFavoriteBots});
  }

  componentDidMount () {

  };

  render () {
    const {userProfile} = {...this.props};
    const damage = userProfile.dmgDealt;
    return (
      <div className='UserProfile container'>
        <div className='row'>
          <button className='bttn-unite bttn-md bttn-primary bttn-no-outline top-bottom-margin' onClick={this.toGameMode}>Back</button>
          <div className='col-sm-12 text-center'>
            <div className='animated bounceInRight col-sm-offset-3 col-sm-6 profile-info top-border'>
              <h2>{userProfile.username}</h2>
              <h3>Single Player Stats</h3>
              <h4><span>Games Played:</span> {userProfile.spGames}</h4>
              <h4><span>Wins:</span> {userProfile.spWins}</h4>
              <h4><span>Loses:</span> {userProfile.spLoses}</h4>
            </div>
            <div className='animated bounceInLeft delay-1s col-sm-offset-3 col-sm-6 profile-info'>
              <h3>Online Stats</h3>
              <h4><span>Games Played:</span> {userProfile.olGames}</h4>
              <h4><span>Wins:</span> {userProfile.olWins}</h4>
              <h4><span>Loses:</span> {userProfile.olLoses}</h4>
            </div>
            <div className='animated bounceInRight delay-2s col-sm-offset-3 col-sm-6 profile-info bottom-border'>
              <h3>Career Stats</h3>
              <h4><span>Total Games Played:</span> {userProfile.spGames + userProfile.olGames}</h4>
              <h4><span>Total Wins:</span> {userProfile.spWins + userProfile.olWins}</h4>
              <h4><span>Total Damage Dealt:</span> {damage.toFixed(1)}</h4>
            </div>
            <FavoriteBots favoriteBots={this.state.sortedFavoriteBots} />
            <div className='col-sm-offset-4 col-sm-4 animated fadeIn delay-4s'>
              <button className='bttn-unite bttn-md bttn-danger bttn-no-outline' onClick={this.deleteAccount}>Delete Account</button>
            </div>
          </div>
        </div>

      </div>
    );
  };
};

export default UserProfile;
