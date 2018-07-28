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

  useSpecialAttack = () => {
    const {gameObject} = {...this.state};
    const {userRobot} = {...gameObject};
    const {enemyRobot} = {...gameObject};
    if (gameObject.turn === 'user') {
      const updatedGameObject =  userRobot.specialAttack(userRobot, enemyRobot, gameObject);
      if (updatedGameObject.enemyRobot.health <= 0) {
        updatedGameObject.userProfile.spWins += 1;
        updatedGameObject.userProfile.spGames += 1;
        updatedGameObject.enemyProfile.spLoses += 1;
        updatedGameObject.enemyProfile.spGames += 1;
        this.setState({gameObject: updatedGameObject});
        this.props.setWinnerProfile(this.state.gameObject.userProfile);
        this.props.setWinnerBot(this.state.gameObject.userRobot);

        const userWin = firebase.database().ref(`mostWins/${updatedGameObject.userRobot.id}/wins`);
        userWin.transaction(function (wins) {
          return wins + 1;
        });

        userRequests.updateUserProfile(gameObject.userProfile.id, updatedGameObject.userProfile).then(() => {
          userRequests.updateUserProfile(updatedGameObject.enemyProfile.id, updatedGameObject.enemyProfile).then(() => {
            this.props.history.push('/winnerscreen');
          }).catch((err) => {
            console.error('Failed to update enemy profile: ', err);
          }
          );
        }).catch((err) => {
          console.error('Failed to update firebase user profile: ', err);
        });
      } else {
        this.setState({gameObject: updatedGameObject});
        window.setTimeout(this.enemyAttack, 1000);
      }
    } else {
      const updatedGameObject = enemyRobot.specialAttack(enemyRobot, userRobot, gameObject);
      if (updatedGameObject.userRobot.health <= 0) {
        updatedGameObject.userProfile.spLoses += 1;
        updatedGameObject.userProfile.spGames += 1;
        updatedGameObject.enemyProfile.spWins += 1;
        updatedGameObject.enemyProfile.spGames += 1;
        this.setState({gameObject: updatedGameObject});
        this.props.setWinnerProfile(this.state.gameObject.enemyProfile);
        this.props.setWinnerBot(this.state.gameObject.enemyRobot);

        const userWin = firebase.database().ref(`mostWins/${updatedGameObject.enemyRobot.id}/wins`);
        userWin.transaction(function (wins) {
          return wins + 1;
        });

        userRequests.updateUserProfile(gameObject.userProfile.id, updatedGameObject.userProfile).then(() => {
          userRequests.updateUserProfile(updatedGameObject.enemyProfile.id, updatedGameObject.enemyProfile).then(() => {
            this.props.history.push('/winnerscreen');
          }).catch((err) => {
            console.error('Failed to update enemy profile: ', err);
          }
          );
        }).catch((err) => {
          console.error('Failed to update firebase user profile: ', err);
        });
      } else {
        this.setState({gameObject: updatedGameObject});
      }
    }
  };

  userAttack = (e) => {
    const {gameObject} = {...this.state};
    if (!this.state.gameObject.attacking) {
      gameObject.attacking = true;
    }
    const {userRobot} = {...gameObject};
    const {enemyRobot} = {...gameObject};
    const {enemyStaticRobot} = {...gameObject};
    if (enemyRobot.debuff === 0) {
      enemyRobot.armor = enemyStaticRobot.armor;
      enemyRobot.evasion = enemyStaticRobot.evasion;
      enemyRobot.attack = enemyStaticRobot.attack;
      enemyRobot.critChance = enemyStaticRobot.critChance;
      enemyRobot.critMulti = enemyStaticRobot.critMulti;
    } else {
      enemyRobot.debuff -= 1;
    }
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
    if (e.code === 'KeyW') {
      enemyRobot.health = 0;
    }
    if (enemyRobot.health <= 0) {
      gameObject.userProfile.spWins += 1;
      gameObject.userProfile.spGames += 1;
      gameObject.enemyProfile.spLoses += 1;
      gameObject.enemyProfile.spGames += 1;
      this.setState({gameObject: gameObject});
      this.props.setWinnerProfile(this.state.gameObject.userProfile);
      this.props.setWinnerBot(this.state.gameObject.userRobot);

      const userWin = firebase.database().ref(`mostWins/${gameObject.userRobot.id}/wins`);
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
    if (enemyRobot.attackCount === enemyRobot.specialCount) {
      this.useSpecialAttack();
      return;
    }
    const {userStaticRobot} = {...gameObject};
    if (userRobot.debuff === 0) {
      userRobot.armor = userStaticRobot.armor;
      userRobot.evasion = userStaticRobot.evasion;
      userRobot.attack = userStaticRobot.attack;
      userRobot.critChance = userStaticRobot.critChance;
      userRobot.critMulti = userStaticRobot.critMulti;
    } else {
      userRobot.debuff -= 1;
    }
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

      const enemyWins = firebase.database().ref(`mostWins/${gameObject.enemyRobot.id}/wins`);
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
    const {userRobot} = {...this.state.gameObject};
    if ((this.state.gameObject.turn === 'user') && e.code === 'KeyA') {
      this.userAttack(e);
    } else if ((this.state.gameObject.turn === 'user') && (e.code === 'KeyS') && (userRobot.attackCount === userRobot.specialCount)) {
      this.useSpecialAttack();
    } else if ((this.state.gameObject.turn === 'user') && e.code === 'KeyW') {
      this.userAttack(e);
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
