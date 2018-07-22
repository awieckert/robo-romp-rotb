import React, { Component } from 'react';
import './BattleBot.css';

class BattleBot extends Component {
  render () {
    const staticBot = {...this.props.staticBot};
    const bot = {...this.props.bot};
    const healthPercent = (bot.health / staticBot.health) * 100;
    const healthStyle = {
      width: `${healthPercent}%`,
    };
    return (
      <div className="BattleBot col-xs-6">
        <div className="progress">
          <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={healthStyle}>
            <span className="sr-only">60% Complete</span>
          </div>
        </div>
        <img src={bot.img} alt="robot"/>
      </div>
    );
  }
}

export default BattleBot;
