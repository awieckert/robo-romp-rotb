import React, { Component } from 'react';
import './SmallBot.css';

class SmallBot extends Component {

  setBot = (e) => {
    if (this.props.smallBotsDisabled === false) {
      const target = e.target.id;
      const bots = [...this.props.bots];
      const currentBot = bots.find(bot => bot.name === target);
      this.props.setLargeBot(currentBot);
    }
  }

  render () {
    const bots = [...this.props.bots];
    const printBots = bots.map((bot) => {
      return (
        <div key={bot.id} data-id={bot.id} className='smallbots'>
          <img src={bot.img} alt='robots' id={bot.name} onClick={this.setBot}/>
        </div>
      );
    });
    return (
      <div className='smallbots-flex'>
        {printBots}
      </div>
    );
  }
}

export default SmallBot;
