import React from 'react';

class FavoriteBots extends React.Component {

  render () {
    const sortedBots = [...this.props.favoriteBots];
    const arrayToMap = [];
    for (let i = 0; i < 3; i++) {
      arrayToMap.push(sortedBots[i]);
    }
    const botsToPrint = arrayToMap.map((bot) => {
      return (
        <div className='col-xs-2'>
          <img src={bot.img} alt="robot"/>
          <h4>Games: {bot.used}</h4>
        </div>
      );
    });
    return (
      <div className=''>
        {botsToPrint}
      </div>
    );
  };
};

export default FavoriteBots;
