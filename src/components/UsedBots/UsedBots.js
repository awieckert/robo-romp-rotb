import React from 'react';
import './UsedBots.css';
import '../../../node_modules/animate.css/animate.min.css';

class UsedBots extends React.Component {

  render () {
    const bots = [...this.props.mostUsedBots];
    const botsToPrint = bots.map((bot) => {
      return (
        <div className='col-xs-4'>
          <img src={bot.img} alt="robots"/>
          <h4>Used: {bot.used}</h4>
        </div>
      );
    });
    return (
      <div className='UsedBots animated fadeIn delay-2s'>
        {botsToPrint}
      </div>
    );
  };
};

export default UsedBots;
