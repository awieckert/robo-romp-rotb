import React, { Component } from 'react';
import favoriteRequests from '../../firebaseRequests/favoriteRequests.js';
import './LargeBot.css';

class LargeBot extends Component {
  state = {
    userProfile: {},
    favoriteBots: {},
    isSelected: false,
  };

  setUserBot = () => {
    this.setState({isSelected: true});
    const bot = {...this.props.bot};
    this.props.setUserRobot(bot);
    this.props.disableSmallBots();
    this.findFavoriteBot(bot);
  };

  findFavoriteBot = (robot) => {
    const favoriteBots = {...this.state.favoriteBots};
    Object.keys(favoriteBots).forEach((key) => {
      if (key === robot.id) {
        favoriteBots[key] += 1;
      }
    });
    favoriteRequests.updateUserFavorites(favoriteBots.id ,favoriteBots).then().catch((err) => {
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
        <div className='info col-xs-6'>
          <h4>{bot.name}</h4>
          <h5>Health: {bot.health}</h5>
          <h5>Attack: {bot.attack}</h5>
          <h5>Armor: {bot.armor}</h5>
          <h5>Crit Chance: {bot.critChance}%</h5>
          <h5>Evasion: {bot.evasion}%</h5>
          <h5>Attacks for Special: {bot.specialCount}</h5>
          <p>{bot.description}</p>
        </div>
        <div className='large-bot-image col-xs-6'>
          <img src={bot.img} alt='bigRobot'/>
          <button className='btn btn-danger' onClick={this.setUserBot}>Confirm Selection</button>
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
