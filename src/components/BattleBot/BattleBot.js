import React, { Component } from 'react';
import SpecialBar from '../SpecialBar/SpecialBar.js';
import './BattleBot.css';

class BattleBot extends Component {

  determineHealth = (bot, staticBot) => {
    const healthPercent = (bot.health / staticBot.health) * 100;
    const healthStyle = {
      width: `${healthPercent}%`,
    };
    return healthStyle;
  };

  setSpecialBar = (bot) => {
    const specialBars = [];
    const fullBar = {
      width: '100%',
    };
    const emptyBar = {
      width: '0%',
    };

    for (let i = 1; i <= bot.specialCount; i++) {
      if (bot.attackCount >= i) {
        specialBars.push(<SpecialBar key={i} bar={fullBar}/>);
      } else {
        specialBars.push(<SpecialBar key={i} bar={emptyBar}/>);
      }
    }
    return specialBars;
  };

  render () {
    const staticBot = {...this.props.staticBot};
    const bot = {...this.props.bot};
    const healthRemaining = this.determineHealth(bot, staticBot);
    const specialBar = this.setSpecialBar(bot);
    return (
      <div className="BattleBot col-xs-6">
        <div className="progress health-bar col-xs-6">
          <div className="progress-bar health-color" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={healthRemaining}>
            <span className="sr-only">60% Complete</span>
          </div>
        </div>
        <img className='robot-img' src={bot.img} alt="robot"/>
        <h3>Special Gauge</h3>
        <div className='special-bar'>
          {specialBar}
        </div>
      </div>
    );
  }
}

export default BattleBot;
