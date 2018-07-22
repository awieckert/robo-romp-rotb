import React, { Component } from 'react';
import BattleBot from '../BattleBot/BattleBot.js';
import './FightArena.css';

class FightArena extends Component {
  state = {
    userRobot: {},
    enemyRobot: {},
    userStaticRobot: {},
    enemyStaticRobot: {},
  };

  componentDidMount () {
    const {userRobot} = {...this.props};
    const {enemyRobot} = {...this.props};
    this.setState({userRobot: userRobot});
    this.setState({userStaticRobot: userRobot});
    this.setState({enemyRobot: enemyRobot});
    this.setState({enemyStaticRobot: enemyRobot});
  };

  render () {
    return (
      <div className="FightArena">
        <h1 className="FightArena-title">FightArena</h1>
        <div className='row'>
          <BattleBot bot={this.state.userRobot} staticBot={this.state.userStaticRobot} />
          <BattleBot bot={this.state.enemyRobot} staticBot={this.state.enemyStaticRobot} />
        </div>
      </div>
    );
  }
}

export default FightArena;
