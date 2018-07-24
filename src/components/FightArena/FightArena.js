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

  // timedEnemyAttack = () => {

  // };

  userAttack = () => {
    const {userRobot} = {...this.state};
    const {enemyRobot} = {...this.state};
    const enemyEvasion = Math.floor(Math.random() * 101);
    const attackDamage = userRobot.swing();
    let damageDealt = 0;
    if (enemyEvasion > enemyRobot.evasion) {
      damageDealt = (attackDamage - enemyRobot.armor);
    }
    enemyRobot.health = (enemyRobot.health - damageDealt);
    userRobot.attackCount += 1;
    this.setState({userRobot: userRobot});
    this.setState({enemyRobot: enemyRobot});
    this.setState({turn: 'enemy'});
    window.setTimeout(this.enemyAttack, 3000);
  };

  enemyAttack = () => {
    const {userRobot} = {...this.state};
    const {enemyRobot} = {...this.state};
    const userEvasion = Math.floor(Math.random() * 101);
    const attackDamage = enemyRobot.swing();
    let damageDealt = 0;
    if (userEvasion > userRobot.evasion) {
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
    if ((this.state.turn === 'user') && e.code === 'KeyA') {
      this.userAttack();
    } else if ((this.state.turn === 'user') && e.code === 'KeyS') {
      this.userSpecialAttack();
    };
  };

  componentDidMount () {
    const {userRobot} = {...this.props};
    const {enemyRobot} = {...this.props};
    const userStaticRobot = {...this.props.userRobot};
    const enemyStaticRobot = {...this.props.enemyRobot};
    userRobot.swing = function () {
      const isCritical = Math.floor((Math.random() * 101));
      if (isCritical <= this.critChance) {
        return (this.attack * this.critMulti);
      } else {
        return this.attack;
      }
    };
    enemyRobot.swing = function () {
      const isCritical = Math.floor((Math.random() * 101));
      if (isCritical <= this.critChance) {
        return (this.attack * this.critMulti);
      } else {
        return this.attack;
      }
    };
    this.setState({userRobot: userRobot});
    this.setState({userStaticRobot: userStaticRobot});
    this.setState({enemyRobot: enemyRobot});
    this.setState({enemyStaticRobot: enemyStaticRobot});
    window.addEventListener('keypress', this.attackFunction);
  };

  componentWillUnmount () {
    window.removeEventListener('keypress', this.attackFunction);
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
