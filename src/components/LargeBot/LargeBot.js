import React, { Component } from 'react';
import firebase from 'firebase';
import onlineMatchRequests from '../../firebaseRequests/onlineMatchRequests.js';
import favoriteRequests from '../../firebaseRequests/favoriteRequests.js';
import './LargeBot.css';
import '../../../node_modules/animate.css/animate.min.css';

class LargeBot extends Component {
  state = {
    userProfile: {},
    favoriteBots: {},
    isSelected: false,
  };

  setUserBot = () => {
    // Function used to set the user selected robot information
    const onlineMatchId = this.props.currentOnlineMatch.id;
    let currentOnlineMatch = {};
    const currentUserUid = firebase.auth().currentUser.uid;
    const bot = {...this.props.bot};

    // Grabbing the most current online game object from firebase. If there is no online game to get from firebase, the .then() still is triggered with onlineMatch = null. This allows for the code inside the then to run.
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

        // Updating the firebase online game object with the most up to date information. Then we are grabbing the most up to date information again. This looks and feels crappy. But it is done to make sure each client has the most up to date version of the online game object. It is possible that within this current then statement the online game object was updated by the second user, making our local copy of the online game object out of date.
        onlineMatchRequests.updateOnlineGame(currentOnlineMatch.id, currentOnlineMatch).then(() => {
          onlineMatchRequests.getCurrentOnlineMatch(currentOnlineMatch.id).then((onlineMatch) => {
            this.props.setCurrentOnlineMatch(onlineMatch);
          }).catch((err) => {
            console.error('Could not get current Online Match: ', err);
          });
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
    // Fucntion is called within the setUserBot function. This is used to find the bot selected within the collection of favorites, add 1 to the number of times used, and then update the firebase favoriteBots collection
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
    // Sets components state with the favoriteBots for the specific user. These are passed down from App's state
    const favoriteBots = {...this.props.favoriteBots};
    this.setState({favoriteBots: favoriteBots});
  };

  render () {
    // Different robot elements will be rendered depending on given states of the app
    const bot = {...this.props.bot};
    let botToPrint = '';
    if ((bot.name && (this.state.isSelected === false)) && !bot.computer) {

      // Checks to see if there is a bot, that the user has not selected and that the bot is not a computer
      botToPrint =  <div>
        <div className='col-xs-6 animated fadeInDown'>
          <div className='flex-center'>
            <img src={bot.img} alt='bigRobot'/>
          </div>
          <div className='flex-center'>
            <button className='bttn-unite bttn-md bttn-warning bttn-no-outline btn-margin-top' onClick={this.setUserBot}>Confirm Selection</button>
          </div>
        </div>

        <div className='info col-xs-6 animated fadeInDown'>
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

      // This JSX is rendered when there is a bot and the user has selected, or when the bot is the computers bot.
      botToPrint = <div>
        <div className='large-bot-image col-xs-6'>
          <img src={bot.img} alt='bigRobot'/>
        </div>
      </div>;
    } else {

      // When no small bot is clicked an empty div is the default
      botToPrint = <div></div>;
    }
    return (
      <div className="LargeBot">
        {botToPrint}
      </div>
    );
  }
}

export default LargeBot;
