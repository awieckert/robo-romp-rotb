import React from 'react';
import './FavoriteBots.css';

class FavoriteBots extends React.Component {
  state = {
    favoriteBots: [],
  };

  filterFunction = () => {
    const sortedBots = [...this.props.favoriteBots];
    const arrayToMap = [];
    sortedBots[0].forEach((item, i) => {
      if (i < 3) {
        arrayToMap.push(item);
      }
    });
    return arrayToMap;
  };

  componentDidMount () {
    const favoriteBots = [...this.props.favoriteBots];
    this.setState({favoriteBots: favoriteBots});
  };

  render () {
    const pleaseMap = this.filterFunction();
    const botsToPrint = pleaseMap.map((bot) => {
      return (
        <div className='col-xs-2'>
          <img src={bot.img} alt="robot"/>
          <h4>Games: {bot.used}</h4>
        </div>
      );
    });
    return (
      <div className='favorite-bots'>
        {botsToPrint}
      </div>
    );
  };
};

export default FavoriteBots;
