import React, { Component } from 'react';
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
    let specialBars = '';
    for (let i = 1; i <= bot.specialCount; i++) {
      if (bot.attackCount >= i) {
        specialBars += `<div className="progress col-xs-2">
          <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 100%;">
            <span className="sr-only">60% Complete</span>
          </div>
        </div>`;
      } else {
        specialBars += `<div className="progress col-xs-2">
          <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
            <span className="sr-only">60% Complete</span>
          </div>
        </div>`;
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
        <div className="progress">
          <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={healthRemaining}>
            <span className="sr-only">60% Complete</span>
          </div>
        </div>
        <img src={bot.img} alt="robot"/>
        <div dangerouslySetInnerHTML={{__html: specialBar}}></div>
      </div>
    );
  }
}

export default BattleBot;
