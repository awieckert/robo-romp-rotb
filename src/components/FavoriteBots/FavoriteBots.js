import React from 'react';

class FavoriteBots extends React.Component {
  state = {
    favoriteBots: [],
  };

  filterFunction = () => {
    const sortedBots = [...this.state.favoriteBots];
    const arrayToMap = [];
    for (let i = 0; i < 3; i++) {
      arrayToMap.push(sortedBots[i]);
    }
    return arrayToMap;
  };

  componentDidMount () {
    const favoriteBots = {...this.props.favoriteBots};
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
      <div className=''>
        {botsToPrint}
      </div>
    );
  };
};

export default FavoriteBots;
