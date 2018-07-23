import React, { Component } from 'react';
import BattleBot from '../BattleBot/BattleBot.js';
import './FightArena.css';

class FightArena extends Component {
  state = {
    userRobot: {},
    enemyRobot: {},
    userStaticRobot: {},
    enemyStaticRobot: {},
    turn: 'user',
  };

  userAttack = () => {
    const {userRobot} = {...this.state};
    const {enemyRobot} = {...this.state};
    const enemyEvasion = Math.floor(Math.random * 101);
    const attackDamage = userRobot.swing();
    let damageDealt = 0;
    if (enemyRobot.evasion >= enemyEvasion) {
      damageDealt = (attackDamage - enemyRobot.armor);
    }
    enemyRobot.health = (enemyRobot.health - damageDealt);
    userRobot.attackCount += 1;
    this.setState({userRobot: userRobot});
    this.setState({enemyRobot: enemyRobot});
    this.setState({turn: 'enemy'});
  };

  enemyAttack = () => {
    const {userRobot} = {...this.state};
    const {enemyRobot} = {...this.state};
    const userEvasion = Math.floor(Math.random * 101);
    const attackDamage = enemyRobot.swing();
    let damageDealt = 0;
    if (userRobot.evasion >= userEvasion) {
      damageDealt = (attackDamage - userRobot.armor);
    }
    userRobot.health = (userRobot.health - damageDealt);
    enemyRobot.attackCount += 1;
    this.setState({userRobot: userRobot});
    this.setState({enemyRobot: enemyRobot});
    this.setState({turn: 'user'});
  };

  attackFunction = (e) => {
    console.log(e);
    const turn = this.state.turn;
    if (turn === 'user') {
      this.userAttack();
    } else if (turn === 'enemy') {
      this.enemyAttack();
    }
  };

  componentDidMount () {
    const {userRobot} = {...this.props};
    const {enemyRobot} = {...this.props};
    const swing = () => {
      const isCritical = Math.floor((Math.random() * 101));
      if (isCritical <= this.critChance) {
        return (this.attack * this.critMulti);
      } else {
        return this.attack;
      }
    };
    userRobot.swing = swing();
    enemyRobot.swing = swing();
    this.setState({userRobot: userRobot});
    this.setState({userStaticRobot: userRobot});
    this.setState({enemyRobot: enemyRobot});
    this.setState({enemyStaticRobot: enemyRobot});
  };

  render () {
    return (
      <div className="FightArena" onKeyPress={this.attackFunction}>
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
