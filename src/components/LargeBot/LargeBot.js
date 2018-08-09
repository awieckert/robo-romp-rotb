import React, { Component } from 'react';
import firebase from 'firebase';
import onlineMatchRequests from '../../firebaseRequests/onlineMatchRequests.js';
import favoriteRequests from '../../firebaseRequests/favoriteRequests.js';
import './LargeBot.css';

class LargeBot extends Component {
  state = {
    userProfile: {},
    favoriteBots: {},
    isSelected: false,
  };

  setUserBot = () => {
    const onlineMatchId = this.props.currentOnlineMatch.id;
    let currentOnlineMatch = {};
    const currentUserUid = firebase.auth().currentUser.uid;
    const bot = {...this.props.bot};
    // breaking because not all data in promise
    onlineMatchRequests.getCurrentOnlineMatch(onlineMatchId).then((onlineMatch) => {
      currentOnlineMatch = onlineMatch;
      if (this.props.onlinePlay) {
        if (currentUserUid === currentOnlineMatch.userProfile.uid) {
          bot.user = 'user1';
        } else {
          bot.user = 'enemy';
        }
        if (currentUserUid === currentOnlineMatch.userProfile.uid) {
          currentOnlineMatch.userRobot = bot;
          currentOnlineMatch.userStaticRobot = bot;
        } else {
          currentOnlineMatch.enemyRobot = bot;
          currentOnlineMatch.enemyStaticRobot = bot;
        }
        onlineMatchRequests.updateOnlineGame(currentOnlineMatch.id, currentOnlineMatch).then(() => {
          onlineMatchRequests.getCurrentOnlineMatch(currentOnlineMatch.id).then((onlineMatch) => {
            this.props.setCurrentOnlineMatch(onlineMatch);
            if (onlineMatch.userProfile.uid && onlineMatch.enemyProfile.uid) {
              this.props.setPlayersReady();
            } else {
              this.props.setPlayersNotReady();
            }
          }).catch((err) => {
            console.error('Could not get current Online Match: ', err);
          });
          // need to get the unique game object and set state with it.
          // check if the user profile's have both been set here and set a flag in state accordingly
        }).catch((err) => {
          console.error('Failed to update Online game object: ', err);
        });
      } else {
        bot.user = 'user1';
      }
      this.props.setUserRobot(bot);
      this.props.disableSmallBots();
      this.findFavoriteBot(bot);
      this.setState({isSelected: true});
    }).catch((err) => {
      console.error('Could not get online match in Large Bot: ', err);
    });

  };

  findFavoriteBot = (robot) => {
    const favoriteBots = {...this.state.favoriteBots};
    Object.keys(favoriteBots).forEach((key) => {
      if (favoriteBots[key].id === robot.id) {
        favoriteBots[key].used += 1;
      }
    });
    favoriteRequests.updateUserFavorites(favoriteBots.id, favoriteBots).then().catch((err) => {
      console.error('Unable to update users favorite robots: ', err);
    });
  };

  componentDidMount () {
    const favoriteBots = {...this.props.favoriteBots};
    this.setState({favoriteBots: favoriteBots});
  };

  render () {
    const bot = {...this.props.bot};
    let botToPrint = '';
    if ((bot.name && (this.state.isSelected === false)) && !bot.computer) {
      botToPrint =  <div>
        <div className='col-xs-6'>
          <div className='flex-center'>
            <img src={bot.img} alt='bigRobot'/>
          </div>
          <div className='flex-center'>
            <button className='bttn-unite bttn-md bttn-warning bttn-no-outline btn-margin-top' onClick={this.setUserBot}>Confirm Selection</button>
          </div>
        </div>

        <div className='info col-xs-6'>
          <h4><strong>{bot.name}</strong></h4>
          <h5><strong>Health:</strong> {bot.health}</h5>
          <h5><strong>Attack:</strong> {bot.attack}</h5>
          <h5><strong>Armor:</strong> {bot.armor}</h5>
          <h5><strong>Crit Chance:</strong> {bot.critChance}%</h5>
          <h5><strong>Evasion:</strong> {bot.evasion}%</h5>
          <h5><strong>Attacks for Special:</strong> {bot.specialCount}</h5>
          <h5><strong>Special Attack:</strong> {bot.superDescription}</h5>
          <p>{bot.description}</p>
        </div>
      </div>;
    } else if ((bot.name && (this.state.isSelected)) || bot.computer) {
      botToPrint = <div>
        <div className='large-bot-image col-xs-6'>
          <img src={bot.img} alt='bigRobot'/>
        </div>
      </div>;
    } else {
      botToPrint = <div></div>;
    }
    return (
      <div className="LargeBot row">
        {botToPrint}
      </div>
    );
  }
}

export default LargeBot;
