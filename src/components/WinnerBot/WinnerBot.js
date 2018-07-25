import React, { Component } from 'react';
import './WinnerBot.css';

class WinnerBot extends Component {
  state = {
    winner: {
      winnerProfile: {},
      winnerBot: {},
    },
  };

  componentDidMount () {
    const {winner} = {...this.state};
    winner.winnerProfile = this.props.winnerProfile;
    winner.winnerBot = this.props.winnerBot;
    this.setState({winner: winner});
  }

  render () {
    const img = this.state.winner.winnerBot.img;
    const userName = this.state.winner.winnerProfile.username;
    const robotName = this.state.winner.winnerBot.name;
    return (
      <div className="WinnerBot text-center">
        <h1 className="WinnerBot-title">{userName} Wins!</h1>
        <img src={img} alt='robot'/>
        <h4>as</h4>
        <h2>{robotName}</h2>
      </div>
    );
  }
}

export default WinnerBot;
