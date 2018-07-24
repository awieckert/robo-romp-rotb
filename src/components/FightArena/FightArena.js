import React, { Component } from 'react';
import BattleBot from '../BattleBot/BattleBot.js';
import AttackResult from '../AttackResult/AttackResult.js';
import './FightArena.css';

class FightArena extends Component {
  state = {
    gameObject: {
      userProfile: {},
      enemyProfile: {},
      userRobot: {},
      enemyRobot: {},
      userStaticRobot: {},
      enemyStaticRobot: {},
      turn: 'user',
      attackDamage: '',
      isCritical: false,
      evaded: false,
      attacking: false,
    },
  };

  userAttack = () => {
    if (!this.state.attacking) {
      this.setState({attacking: true});
    }
    const {userRobot} = {...this.state};
    const {enemyRobot} = {...this.state};
    const enemyEvasion = Math.floor(Math.random() * 101);
    const attackDamage = userRobot.swing();
    let damageDealt = 0;
    if (enemyEvasion > enemyRobot.evasion) {
      damageDealt = (attackDamage - enemyRobot.armor);
      this.setState({evaded: false});
      this.setState({isCritical: false});
      if (attackDamage > userRobot.attack) {
        this.setState({isCritical: true});
      }
    } else {
      this.setState({isCritical: false});
      this.setState({evaded: true});
    }
    enemyRobot.health = (enemyRobot.health - damageDealt);
    userRobot.attackCount += 1;
    this.setState({attackDamage: damageDealt});
    this.setState({userRobot: userRobot});
    this.setState({enemyRobot: enemyRobot});
    if (enemyRobot.health <= 0) {
      this.props.setWinnerProfile(this.state.userProfile);
      this.props.setWinnerBot(this.state.userRobot);
      this.props.history.push('/winnerscreen');
    } else {
      this.setState({turn: 'enemy'});
      window.setTimeout(this.enemyAttack, 1000);
    }
  };

  enemyAttack = () => {
    const {userRobot} = {...this.state};
    const {enemyRobot} = {...this.state};
    const userEvasion = Math.floor(Math.random() * 101);
    const attackDamage = enemyRobot.swing();
    let damageDealt = 0;
    if (userEvasion > userRobot.evasion) {
      damageDealt = (attackDamage - userRobot.armor);
      this.setState({evaded: false});
      this.setState({isCritical: false});
      if (attackDamage > enemyRobot.attack) {
        this.setState({isCritical: true});
      }
    } else {
      this.setState({isCritical: false});
      this.setState({evaded: true});
    }
    userRobot.health = (userRobot.health - damageDealt);
    enemyRobot.attackCount += 1;
    this.setState({userRobot: userRobot});
    this.setState({enemyRobot: enemyRobot});
    if (userRobot.health <= 0) {
      this.props.setWinnerProfile(this.state.enemyProfile);
      this.props.setWinnerBot(this.state.enemyRobot);
      this.props.history.push('/winnerscreen');
    } else {
      this.setState({turn: 'user'});
    }
  };

  attackFunction = (e) => {
    console.log(e);
    if ((this.state.turn === 'user') && e.code === 'KeyA') {
      this.userAttack();
    } else if ((this.state.turn === 'user') && e.code === 'KeyS') {
      this.userSpecialAttack();
    };
  };

  displayDamage = () => {
    let displayDamage = {};
    if (this.state.attacking) {
      displayDamage = <AttackResult attackDamage={this.state.attackDamage} evaded={this.state.evaded} isCritical={this.state.isCritical}/>;
    } else {
      displayDamage = <div></div>;
    }
    return displayDamage;
  };

  componentDidMount () {
    const {userProfile} = {...this.props};
    const {enemyProfile} = {...this.props};
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
    this.setState({userProfile: userProfile});
    this.setState({enemyProfile: enemyProfile});
    window.addEventListener('keypress', this.attackFunction);
  };

  componentWillUnmount () {
    window.removeEventListener('keypress', this.attackFunction);
  };

  render () {
    const attackDamage = this.displayDamage();
    return (
      <div className="FightArena">
        <h1 className="FightArena-title">FightArena</h1>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='col-xs-4 col-offset-xs-4'>
              {attackDamage}
            </div>
          </div>
        </div>
        <div className='row'>
          <BattleBot bot={this.state.userRobot} staticBot={this.state.userStaticRobot} />
          <BattleBot bot={this.state.enemyRobot} staticBot={this.state.enemyStaticRobot} />
        </div>
      </div>
    );
  }
}

export default FightArena;
