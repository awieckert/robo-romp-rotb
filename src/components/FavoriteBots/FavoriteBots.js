import React from 'react';
import './FavoriteBots.css';

class FavoriteBots extends React.Component {
  state = {
    favoriteBots: [],
  };

  filterFunction = () => {
    // Takes the sorted bots passed to it from App and returns the three most used bots.
    const sortedBots = [...this.props.favoriteBots];
    const arrayToMap = [];
    sortedBots[0].forEach((item, i) => {
      if (i < 3) {
        arrayToMap.push(item);
      }
    });
    return arrayToMap;
  };

  render () {
    const pleaseMap = this.filterFunction();

    // Maps over the filtered favorite bots and returns the JSX to print for each bot
    const botsToPrint = pleaseMap.map((bot) => {
      return (
        <div className='col-xs-2'>
          <img src={bot.img} alt="robot"/>
          <h4>Games: {bot.used}</h4>
        </div>
      );
    });
    return (
      <div className='FavoriteBots col-sm-12 animated fadeInUp delay-3s'>
        {botsToPrint}
      </div>
    );
  };
};

export default FavoriteBots;
