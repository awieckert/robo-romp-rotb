import React from 'react';
import './WinningBots.css';

class WinningBots extends React.Component {

  render () {
    const bots = this.props.winningBots;
    const botsToPrint = bots.map((bot) => {
      return (
        <div className='col-xs-4'>
          <img src={bot.img} alt="robots"/>
          <h4>Wins: {bot.wins}</h4>
        </div>
      );
    });
    return (
      {botsToPrint}
    );
  };
};

export default WinningBots;
