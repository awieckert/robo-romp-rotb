import React, { Component } from 'react';
import firebase from 'firebase';
import BattleBot from '../BattleBot/BattleBot.js';
import AttackResult from '../AttackResult/AttackResult.js';
import userRequests from '../../firebaseRequests/userRequests.js';
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
    const {gameObject} = {...this.state};
    if (!this.state.gameObject.attacking) {
      gameObject.attacking = true;
    }
    const {userRobot} = {...gameObject};
    const {enemyRobot} = {...gameObject};
    const enemyEvasion = Math.floor(Math.random() * 101);
    const attackDamage = userRobot.swing();
    let damageDealt = 0;
    if (enemyEvasion > enemyRobot.evasion) {
      damageDealt = (attackDamage - enemyRobot.armor);
      gameObject.evaded = false;
      gameObject.isCritical = false;
      if (attackDamage > userRobot.attack) {
        gameObject.isCritical = true;
        gameObject.evaded = false;
      }
    } else {
      gameObject.isCritical = false;
      gameObject.evaded = true;
    }
    damageDealt = (damageDealt.toFixed(1) * 1);
    gameObject.userProfile.dmgDealt += damageDealt;
    enemyRobot.health = (enemyRobot.health - damageDealt);
    userRobot.attackCount += 1;
    gameObject.attackDamage = damageDealt;
    gameObject.userRobot = userRobot;
    gameObject.enemyRobot = enemyRobot;
    if (enemyRobot.health <= 0) {
      gameObject.userProfile.spWins += 1;
      gameObject.userProfile.spGames += 1;
      gameObject.enemyProfile.spLoses += 1;
      gameObject.enemyProfile.spGames += 1;
      this.setState({gameObject: gameObject});
      this.props.setWinnerProfile(this.state.gameObject.userProfile);
      this.props.setWinnerBot(this.state.gameObject.userRobot);

      const userWin = firebase.database().ref(`mostUsed/${gameObject.userRobot.id}/wins`);
      userWin.transaction(function (wins) {
        return wins + 1;
      });

      userRequests.updateUserProfile(gameObject.userProfile.id ,gameObject.userProfile).then(() => {
        userRequests.updateUserProfile(gameObject.enemyProfile.id, gameObject.enemyProfile).then(() => {
          this.props.history.push('/winnerscreen');
        }).catch((err) => {
          console.error('Failed to update enemy profile: ', err);
        }
        );
      }).catch((err) => {
        console.error('Failed to update firebase user profile: ', err);
      });
    } else {
      gameObject.turn = 'enemy';
      this.setState({gameObject: gameObject});
      window.setTimeout(this.enemyAttack, 1000);
    }
  };

  enemyAttack = () => {
    const {gameObject} = {...this.state};
    const {userRobot} = {...gameObject};
    const {enemyRobot} = {...gameObject};
    const userEvasion = Math.floor(Math.random() * 101);
    const attackDamage = enemyRobot.swing();
    let damageDealt = 0;
    if (userEvasion > userRobot.evasion) {
      damageDealt = (attackDamage - userRobot.armor);
      gameObject.evaded = false;
      gameObject.isCritical = false;
      if (attackDamage > enemyRobot.attack) {
        gameObject.isCritical = true;
        gameObject.evaded = false;
      }
    } else {
      gameObject.isCritical = false;
      gameObject.evaded = true;
    }
    damageDealt = (damageDealt.toFixed(1) * 1);
    userRobot.health = (userRobot.health - damageDealt);
    enemyRobot.attackCount += 1;
    gameObject.attackDamage = damageDealt;
    gameObject.userRobot = userRobot;
    gameObject.enemyRobot = enemyRobot;
    if (userRobot.health <= 0) {
      gameObject.enemyProfile.spWins += 1;
      gameObject.enemyProfile.spGames += 1;
      gameObject.userProfile.spLoses += 1;
      gameObject.userProfile.spGames += 1;
      this.setState({gameObject: gameObject});
      this.props.setWinnerProfile(this.state.gameObject.enemyProfile);
      this.props.setWinnerBot(this.state.gameObject.enemyRobot);

      const enemyWins = firebase.database().ref(`mostUsed/${gameObject.enemyRobot.id}/wins`);
      enemyWins.transaction(function (wins) {
        return wins + 1;
      });

      userRequests.updateUserProfile(gameObject.userProfile.id ,gameObject.userProfile).then(() => {
        userRequests.updateUserProfile(gameObject.enemyProfile.id, gameObject.enemyProfile).then(() => {
          this.props.history.push('/winnerscreen');
        }).catch((err) => {
          console.error('Failed to update enemy profile: ', err);
        }
        );
      }).catch((err) => {
        console.error('Failed to update firebase user profile: ', err);
      });
    } else {
      gameObject.turn = 'user';
      this.setState({gameObject: gameObject});
    }
  };

  attackFunction = (e) => {
    if ((this.state.gameObject.turn === 'user') && e.code === 'KeyA') {
      this.userAttack();
    } else if ((this.state.gameObject.turn === 'user') && e.code === 'KeyS') {
      this.userSpecialAttack();
    };
  };

  displayDamage = () => {
    let displayDamage = {};
    if (this.state.gameObject.attacking) {
      displayDamage = <AttackResult attackDamage={this.state.gameObject.attackDamage} evaded={this.state.gameObject.evaded} isCritical={this.state.gameObject.isCritical}/>;
    } else {
      displayDamage = <div></div>;
    }
    return displayDamage;
  };

  componentDidMount () {
    const gameObject = {...this.state.gameObject};
    gameObject.userProfile = {...this.props.userProfile};
    gameObject.enemyProfile = {...this.props.enemyProfile};
    gameObject.userRobot = {...this.props.userRobot};
    gameObject.enemyRobot = {...this.props.enemyRobot};
    gameObject.userStaticRobot = {...this.props.userRobot};
    gameObject.enemyStaticRobot = {...this.props.enemyRobot};
    gameObject.userRobot.swing = function () {
      const isCritical = Math.floor((Math.random() * 101));
      if (isCritical <= this.critChance) {
        return (this.attack * this.critMulti);
      } else {
        return this.attack;
      }
    };
    gameObject.enemyRobot.swing = function () {
      const isCritical = Math.floor((Math.random() * 101));
      if (isCritical <= this.critChance) {
        return (this.attack * this.critMulti);
      } else {
        return this.attack;
      }
    };
    this.setState({gameObject: gameObject});

    const userUsed = firebase.database().ref(`mostUsed/${gameObject.userRobot.id}/used`);
    userUsed.transaction(function (used) {
      return used + 1;
    });

    const enemyUsed = firebase.database().ref(`mostUsed/${gameObject.enemyRobot.id}/used`);
    enemyUsed.transaction(function (used) {
      return used + 1;
    });

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
            <div className='col-xs-4 col-sm-offset-4 text-center'>
              {attackDamage}
            </div>
          </div>
        </div>
        <div className='row'>
          <BattleBot bot={this.state.gameObject.userRobot} staticBot={this.state.gameObject.userStaticRobot} />
          <BattleBot bot={this.state.gameObject.enemyRobot} staticBot={this.state.gameObject.enemyStaticRobot} />
        </div>
      </div>
    );
  }
}

export default FightArena;
