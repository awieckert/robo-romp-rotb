import React, { Component } from 'react';
import firebase from 'firebase';
import BattleBot from '../BattleBot/BattleBot.js';
import AttackResult from '../AttackResult/AttackResult.js';
import specialAttacks from '../../specialAttacks.js';
import userRequests from '../../firebaseRequests/userRequests.js';
import './FightArena.css';
import onlineMatchRequests from '../../firebaseRequests/onlineMatchRequests.js';
import basicAttack from '../../basicAttack.js';

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
        this.props.setWinnerProfile(updatedGameObject.userProfile);
        this.props.setWinnerBot(updatedGameObject.userRobot);

        const userWin = firebase.database().ref(`mostWins/${updatedGameObject.userRobot.id}/wins`);
        userWin.transaction(function (wins) {
          return wins + 1;
        });

        userRequests.updateUserProfile(gameObject.userProfile.id, updatedGameObject.userProfile).then(() => {
          userRequests.updateUserProfile(updatedGameObject.enemyProfile.id, updatedGameObject.enemyProfile).then(() => {
            if (this.props.onlinePlay) {
              onlineMatchRequests.updateOnlineGame(updatedGameObject.id, updatedGameObject).then(() => {
                this.setState({gameObject: updatedGameObject});
                this.props.history.push('/winnerscreen');
              }).catch((err) => {
                console.error('Failed to updated online game: ', err);
              });
            }
          }).catch((err) => {
            console.error('Failed to update enemy profile: ', err);
          }
          );
        }).catch((err) => {
          console.error('Failed to update firebase user profile: ', err);
        });
      } else {
        if (this.props.onlinePlay) {
          onlineMatchRequests.updateOnlineGame(updatedGameObject.id, updatedGameObject).then(() => {
            this.setState({gameObject: updatedGameObject});
          }).catch((err) => {
            console.error('Failed to updated online game: ', err);
          });
        } else {
          this.setState({gameObject: updatedGameObject});
          window.setTimeout(this.enemyAttack, 1000);
        }
      }
    } else {
      const updatedGameObject = enemyRobot.specialAttack(enemyRobot, userRobot, gameObject);
      if (updatedGameObject.userRobot.health <= 0) {
        updatedGameObject.userProfile.spLoses += 1;
        updatedGameObject.userProfile.spGames += 1;
        updatedGameObject.enemyProfile.spWins += 1;
        updatedGameObject.enemyProfile.spGames += 1;

        this.props.setWinnerProfile(updatedGameObject.enemyProfile);
        this.props.setWinnerBot(updatedGameObject.enemyRobot);

        const userWin = firebase.database().ref(`mostWins/${updatedGameObject.enemyRobot.id}/wins`);
        userWin.transaction(function (wins) {
          return wins + 1;
        });

        userRequests.updateUserProfile(gameObject.userProfile.id, updatedGameObject.userProfile).then(() => {
          userRequests.updateUserProfile(updatedGameObject.enemyProfile.id, updatedGameObject.enemyProfile).then(() => {
            if (this.props.onlinePlay) {
              onlineMatchRequests.updateOnlineGame(updatedGameObject.id, updatedGameObject).then(() => {
                this.setState({gameObject: updatedGameObject});
                this.props.history.push('/winnerscreen');
              }).catch((err) => {
                console.error('Failed to update online game: ', err);
              });
            }
          }).catch((err) => {
            console.error('Failed to update enemy profile: ', err);
          }
          );
        }).catch((err) => {
          console.error('Failed to update firebase user profile: ', err);
        });
      } else {
        if (this.props.onlinePlay) {
          onlineMatchRequests.updateOnlineGame(updatedGameObject.id, updatedGameObject).then(() => {
            this.setState({gameObject: updatedGameObject});
          }).catch((err) => {
            console.error('Failed to updated online game: ', err);
          });
        } else {
          this.setState({gameObject: updatedGameObject});
        }
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
    if (e.key === 'w') {
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
          if (this.props.onlinePlay) {
            onlineMatchRequests.updateOnlineGame(gameObject.id, gameObject).then(() => {
              this.props.history.push('/winnerscreen');
            }).catch((err) => {
              console.error('Failed to update online game: ', err);
            });
          } else {
            this.setState({gameObject: gameObject});
            this.props.history.push('/winnerscreen');
          }
        }).catch((err) => {
          console.error('Failed to update enemy profile: ', err);
        }
        );
      }).catch((err) => {
        console.error('Failed to update firebase user profile: ', err);
      });

    } else {
      gameObject.turn = 'enemy';
      if (this.props.onlinePlay) {
        onlineMatchRequests.updateOnlineGame(gameObject.id, gameObject).then().catch((err) => {
          console.error('Failed to update online game: ', err);
        });
      } else {
        this.setState({gameObject: gameObject});
        window.setTimeout(this.enemyAttack, 1000);
      }
    }
  };

  enemyAttack = () => {
    const {gameObject} = {...this.state};
    const {userRobot} = {...gameObject};
    const {enemyRobot} = {...gameObject};
    if (!this.props.onlinePlay && (enemyRobot.attackCount >= enemyRobot.specialCount)) {
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
      this.props.setWinnerProfile(this.state.gameObject.enemyProfile);
      this.props.setWinnerBot(this.state.gameObject.enemyRobot);

      const enemyWins = firebase.database().ref(`mostWins/${gameObject.enemyRobot.id}/wins`);
      enemyWins.transaction(function (wins) {
        return wins + 1;
      });

      userRequests.updateUserProfile(gameObject.userProfile.id ,gameObject.userProfile).then(() => {
        userRequests.updateUserProfile(gameObject.enemyProfile.id, gameObject.enemyProfile).then(() => {
          if (this.props.onlinePlay) {
            onlineMatchRequests.updateOnlineGame(gameObject.id, gameObject).then(() => {
              this.props.history.push('/winnerscreen');
            }).catch((err) => {
              console.error('Failed to update online game: ', err);
            });
          } else {
            this.setState({gameObject: gameObject});
            this.props.history.push('/winnerscreen');
          }
        }).catch((err) => {
          console.error('Failed to update enemy profile: ', err);
        }
        );
      }).catch((err) => {
        console.error('Failed to update firebase user profile: ', err);
      });

    } else {
      gameObject.turn = 'user';
      if (this.props.onlinePlay) {
        onlineMatchRequests.updateOnlineGame(gameObject.id, gameObject).then().catch((err) => {
          console.error('Failed to update online game: ', err);
        });
      } else {
        this.setState({gameObject: gameObject});
      }
    }
  };

  attackFunction = (e) => {
    const {gameObject} = {...this.state};
    const {userProfile} = {...this.state.gameObject};
    const {enemyProfile} = {...this.state.gameObject};
    const {userRobot} = {...this.state.gameObject};
    const {enemyRobot} = {...this.state.gameObject};
    const currentUid = firebase.auth().currentUser.uid;

    if (this.props.onlinePlay) {
      if ((gameObject.turn === 'user') && (e.key === 'a') && (currentUid === userProfile.uid)) {
        this.userAttack(e);
      } else if ((gameObject.turn === 'user') && (e.key === 's') && (currentUid === userProfile.uid) && (userRobot.attackCount >= userRobot.specialCount)) {
        this.useSpecialAttack();
      } else if ((gameObject.turn === 'enemy') && (e.key === 'a') && (currentUid === enemyProfile.uid)) {
        this.enemyAttack(e);
      } else if ((gameObject.turn === 'enemy') && (e.key === 's') && (currentUid === enemyProfile.uid) && (enemyRobot.attackCount >= enemyRobot.specialCount)) {
        this.useSpecialAttack();
      }
    } else {
      if ((this.state.gameObject.turn === 'user') && e.key === 'a') {
        this.userAttack(e);
      } else if ((this.state.gameObject.turn === 'user') && (e.key === 's') && (userRobot.attackCount >= userRobot.specialCount)) {
        this.useSpecialAttack();
      } else if ((this.state.gameObject.turn === 'user') && e.key === 'w') {
        this.userAttack(e);
      } else if ((this.state.gameObject.turn === 'enemy') && e.key === 'a') {
        this.enemyAttack(e);
      } else if ((this.state.gameObject.turn === 'enemy') && (e.key === 's') && (enemyRobot.attackCount >= enemyRobot.specialCount)) {
        this.useSpecialAttack();
      }
    }
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
    let gameObject = {};

    if (!this.props.onlinePlay) {
      gameObject = {...this.state.gameObject};
      gameObject.userProfile = {...this.props.userProfile};
      gameObject.enemyProfile = {...this.props.enemyProfile};
      gameObject.userRobot = {...this.props.userRobot};
      gameObject.enemyRobot = {...this.props.enemyRobot};
      gameObject.userStaticRobot = {...this.props.userRobot};
      gameObject.enemyStaticRobot = {...this.props.enemyRobot};

      gameObject.userRobot.swing = basicAttack.swing;
      gameObject.enemyRobot.swing = basicAttack.swing;

      this.setState({gameObject: gameObject});
    } else if (this.props.onlinePlay) {
      gameObject = {...this.props.currentOnlineMatch};
      onlineMatchRequests.joinGame(gameObject.id, gameObject).then(() => {

        const rootRef = firebase.database();
        const gameRef = rootRef.ref('onlineMatches/' + gameObject.id);
        gameRef.on('value', (snapshot) => {
          const newGameObject = snapshot.val();

          newGameObject.userRobot.swing = basicAttack.swing;
          newGameObject.enemyRobot.swing = basicAttack.swing;

          Object.keys(specialAttacks).forEach((key) => {
            if (key === newGameObject.userRobot.id) {
              newGameObject.userRobot.specialAttack = specialAttacks[key];
            } else if (key === newGameObject.enemyRobot.id) {
              newGameObject.enemyRobot.specialAttack = specialAttacks[key];
            }
          });

          // This if statement is needed for the losing player. Without checking the state of the firebase object that is returned after it's updated, the loser will not be pushed to the winnerscreen and able to play again.

          if (newGameObject.userRobot.health <= 0) {
            this.props.setWinnerProfile(this.state.gameObject.enemyProfile);
            this.props.setWinnerBot(this.state.gameObject.enemyRobot);
            this.setState({gameObject: newGameObject});
            this.props.history.push('/winnerscreen');
          } else if (newGameObject.enemyRobot.health <= 0) {
            this.props.setWinnerProfile(this.state.gameObject.userProfile);
            this.props.setWinnerBot(this.state.gameObject.userRobot);
            this.setState({gameObject: newGameObject});
            this.props.history.push('/winnerscreen');
          } else {
            this.setState({gameObject: newGameObject});
          }
        });
      }).catch((err) => {
        console.error('Failed to updated firebase gameobject: ', err);
      });
    }

    // Issue! Cannot send functions to firebase, will need to figure out a way to have the swing and special attacks added to the robots everytime

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
    // Need to check to see if onlinePlay is true && playersReady is true, if so then we will display the fight arena. If onlinePlay is true and playerReady is false, show waiting. if onlinePlay is false so singlePlayer screen.
    const attackDamage = this.displayDamage();
    if (!this.props.onlinePlay || (this.state.gameObject.userRobot.name && this.state.gameObject.enemyRobot.name)) {
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
    } else {
      return (
        <div className='FightArena'>
          <h1>Waiting on other player!</h1>
        </div>
      );
    }
  }
}

export default FightArena;
