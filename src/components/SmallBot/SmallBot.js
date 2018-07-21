import React, { Component } from 'react';
import './SmallBot.css';

class SmallBot extends Component {
  render () {
    const bots = [...this.props.bots];
    const printBots = bots.map((bot) => {
      return (
        <div className='col-xs-1'>
          <img src={bot.img} alt='robots'/>
          <p>{bot.name}</p>
        </div>
      );
    });
    return (
      <div>
        {printBots}
      </div>
    );
  }
}

export default SmallBot;
