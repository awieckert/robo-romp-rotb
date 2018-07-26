import React from 'react';
import userRequests from '../../firebaseRequests/userRequests.js';
import './UserProfile.css';

class UserProfile extends React.Component {
  state = {
    userProfile: {},
  };

  deleteAccount = () => {
    const areYouSure = prompt('Are you sure you want to delete? If so type YES');
    if (areYouSure === 'YES') {
      userRequests.reallyDeleteTheAccount(this.state.userProfile.id).then(() => {
        this.props.setAuthedFalse();
        this.props.history.push('/');
      }).catch((err) => {
        console.error('Failed to delete the user account');
      });
    }
  };

  componentDidMount () {
    this.setState({userProfile: this.props.userProfile});
  };

  render () {
    const {userProfile} = {...this.props};
    const damage = userProfile.dmgDealt;
    return (
      <div className='container'>
        <div className='row'>
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
            <h3>Global Stats</h3>
            <h4>Total Damage Dealt: {damage.toFixed(1)}</h4>
            <br/>
            <button className='btn btn-danger' onClick={this.deleteAccount}>Delete Account</button>
          </div>
        </div>

      </div>
    );
  };
};

export default UserProfile;
