import React from 'react';
import './WinningBots.css';
import '../../../node_modules/animate.css/animate.min.css';

class WinningBots extends React.Component {

  render () {
    const bots = [...this.props.winningBots];
    const botsToPrint = bots.map((bot) => {
      return (
        <div className='col-xs-4'>
          <img src={bot.img} alt="robots"/>
          <h4>Wins: {bot.wins}</h4>
        </div>
      );
    });
    return (
      <div className='WinningBots animated fadeIn delay-2s'>
        {botsToPrint}
      </div>
    );
  };
};

export default WinningBots;
