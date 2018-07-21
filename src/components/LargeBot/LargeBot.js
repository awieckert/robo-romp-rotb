import React, { Component } from 'react';
import './LargeBot.css';

class LargeBot extends Component {
  state = {
    isSelected: false,
  };

  setUserBot = () => {
    this.setState({isSelected: true});
    const bot = {...this.props.bot};
    this.props.setUserRobot(bot);
    this.props.disableSmallBots();
  };

  render () {
    const bot = {...this.props.bot};
    let botToPrint = '';
    if (bot.name && (this.state.isSelected === false)) {
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
    } else if (bot.name && (this.state.isSelected)) {
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
