import React, { Component } from 'react';
import './SmallBot.css';

class SmallBot extends Component {

  setBot = (e) => {
    const target = e.target.id;
    const bots = [...this.props.bots];
    const currentBot = bots.find(bot => bot.name === target);
    this.props.setLargeBot(currentBot);
  }

  render () {
    const bots = [...this.props.bots];
    const printBots = bots.map((bot) => {
      return (
        <div className='col-xs-1'>
          <img src={bot.img} alt='robots' id={bot.name} onClick={this.setBot}/>
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
