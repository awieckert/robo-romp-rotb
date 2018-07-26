import React from 'react';
import './UserProfile.css';

class UserProfile extends React.Component {

  render () {
    const {userProfile} = {...this.props};
    const damage = userProfile.dmgDealt;
    const damageDealt = damage.toFixed(1);
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12 text-center'>
            <h2>{userProfile.username}</h2>
            <h4>Single Player Wins: {userProfile.spWins}</h4>
            <h4>Single Player Loses: {userProfile.spLoses}</h4>
            <h4>Single Player Games: {userProfile.spGames}</h4>
            <br/>
            <h4>Online Wins: {userProfile.olWins}</h4>
            <h4>Online Loses: {userProfile.olLoses}</h4>
            <h4>Online Games: {userProfile.olGames}</h4>
            <br/>
            <h4>Total Damage Dealt: {damageDealt}</h4>
          </div>
        </div>

      </div>
    );
  };
};

export default UserProfile;
