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
    bot.user = 'user1';
    this.props.setUserRobot(bot);
    this.props.disableSmallBots();
    this.findFavoriteBot(bot);
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
        <div className='info col-xs-6'>
          <h4>{bot.name}</h4>
          <h5>Health: {bot.health}</h5>
          <h5>Attack: {bot.attack}</h5>
          <h5>Armor: {bot.armor}</h5>
          <h5>Crit Chance: {bot.critChance}%</h5>
          <h5>Evasion: {bot.evasion}%</h5>
          <h5>Attacks for Special: {bot.specialCount}</h5>
          <h5>Special Attack: {bot.superDescription}</h5>
          <p>{bot.description}</p>
        </div>
        <div className='col-xs-6'>
          <div className='flex-center'>
            <img src={bot.img} alt='bigRobot'/>
          </div>
          <div className='flex-center'>
            <button className='btn btn-danger btn-margin-top' onClick={this.setUserBot}>Confirm Selection</button>
          </div>

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
