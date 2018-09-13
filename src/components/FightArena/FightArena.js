import React, { Component } from 'react';
import firebase from 'firebase';
import BattleBot from '../BattleBot/BattleBot.js';
import AttackResult from '../AttackResult/AttackResult.js';
import specialAttacks from '../../specialAttacks.js';
import userRequests from '../../firebaseRequests/userRequests.js';
import './FightArena.css';
import onlineMatchRequests from '../../firebaseRequests/onlineMatchRequests.js';
import basicAttack from '../../basicAttack.js';
import '../../../node_modules/animate.css/animate.min.css';

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
      specialUsed: false,
    },
  };

  useSpecialAttack = () => {
    const {gameObject} = {...this.state};
    const {userRobot} = {...gameObject};
    const {enemyRobot} = {...gameObject};
    gameObject.specialUsed = true;
    if (gameObject.turn === 'user') {
      const updatedGameObject =  userRobot.specialAttack(userRobot, enemyRobot, gameObject);
      if (updatedGameObject.enemyRobot.health <= 0) {
        if (this.props.onlinePlay) {
          updatedGameObject.userProfile.olWins += 1;
          updatedGameObject.userProfile.olGames += 1;
          updatedGameObject.enemyProfile.olLoses += 1;
          updatedGameObject.enemyProfile.olGames += 1;
        } else {
          updatedGameObject.userProfile.spWins += 1;
          updatedGameObject.userProfile.spGames += 1;
          updatedGameObject.enemyProfile.spLoses += 1;
          updatedGameObject.enemyProfile.spGames += 1;
        }

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
                const player1WinsUrl = '../../audio/player1-wins.mp3';
                const playerWinsAudio = new Audio(player1WinsUrl);
                window.setTimeout(() => { playerWinsAudio.play(); }, 1000);
                this.props.history.push('/winnerscreen');
              }).catch((err) => {
                console.error('Failed to updated online game: ', err);
              });
            } else {
              this.setState({gameObject: updatedGameObject});
              const player1WinsUrl = '../../audio/player1-wins.mp3';
              const playerWinsAudio = new Audio(player1WinsUrl);
              window.setTimeout(() => { playerWinsAudio.play(); }, 1000);
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
        if (this.props.onlinePlay) {
          updatedGameObject.userProfile.olLoses += 1;
          updatedGameObject.userProfile.olGames += 1;
          updatedGameObject.enemyProfile.olWins += 1;
          updatedGameObject.enemyProfile.olGames += 1;
        } else {
          updatedGameObject.userProfile.spLoses += 1;
          updatedGameObject.userProfile.spGames += 1;
          updatedGameObject.enemyProfile.spWins += 1;
          updatedGameObject.enemyProfile.spGames += 1;
        }

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
                const player2WinsUrl = '../../audio/player2-wins.mp3';
                const playerWinsAudio = new Audio(player2WinsUrl);
                window.setTimeout(() => { playerWinsAudio.play(); }, 1000);
                this.props.history.push('/winnerscreen');
              }).catch((err) => {
                console.error('Failed to update online game: ', err);
              });
            } else {
              this.setState({gameObject: updatedGameObject});
              const player2WinsUrl = '../../audio/player2-wins.mp3';
              const playerWinsAudio = new Audio(player2WinsUrl);
              window.setTimeout(() => { playerWinsAudio.play(); }, 1000);
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
    // This function is used to do all attack calculations and update the state/firebase online game object if needed
    const {gameObject} = {...this.state};
    // Special used is flag to determine special attack animation
    gameObject.specialUsed = false;
    // For first attack of the game the gameObject flag of attacking needs to be set to true in order to display the damage
    if (!this.state.gameObject.attacking) {
      gameObject.attacking = true;
    }
    const {userRobot} = {...gameObject};
    const {enemyRobot} = {...gameObject};
    const {enemyStaticRobot} = {...gameObject}; // Static robot is created so that we can do stat comparisons relative to the initial state of the robots stats.

    // If there is nolonger a debuff on the enemy set the fighting robot's stats back to their initial state, except for health of course
    if (enemyRobot.debuff === 0) {
      enemyRobot.armor = enemyStaticRobot.armor;
      enemyRobot.evasion = enemyStaticRobot.evasion;
      enemyRobot.attack = enemyStaticRobot.attack;
      enemyRobot.critChance = enemyStaticRobot.critChance;
      enemyRobot.critMulti = enemyStaticRobot.critMulti;
    } else {
      enemyRobot.debuff -= 1;
    }

    // Generate random number betweeon 0 and 100 for evasion number needed to evade the income attack.
    const enemyEvasion = Math.floor(Math.random() * 101);
    // Call robots attack function
    const attackDamage = userRobot.swing();
    let damageDealt = 0;

    // If the enemyRobot's evasion is less than the needed evasion number (enemyEvasion) than the attack lands
    if (enemyEvasion > enemyRobot.evasion) {
      damageDealt = (attackDamage - enemyRobot.armor);
      gameObject.evaded = false;
      gameObject.isCritical = false;
      userRobot.attackCount += 1;
      // if the attackDamage after swing is greate than the robots base damage we know that it was a critical strike
      if (attackDamage > userRobot.attack) {
        gameObject.isCritical = true;
        gameObject.evaded = false;
      }
    } else {
      gameObject.isCritical = false;
      gameObject.evaded = true;
    }
    damageDealt = (damageDealt.toFixed(1) * 1);

    // Updating career damage dealt for the user profile
    gameObject.userProfile.dmgDealt += damageDealt;

    enemyRobot.health = (enemyRobot.health - damageDealt);

    gameObject.attackDamage = damageDealt;
    gameObject.userRobot = userRobot;
    gameObject.enemyRobot = enemyRobot;
    if (e.key === 'w') {
      enemyRobot.health = 0;
    }
    if (enemyRobot.health <= 0) {
      if (this.props.onlinePlay) {
        gameObject.userProfile.olWins += 1;
        gameObject.userProfile.olGames += 1;
        gameObject.enemyProfile.olLoses += 1;
        gameObject.enemyProfile.olGames += 1;
      } else {
        gameObject.userProfile.spWins += 1;
        gameObject.userProfile.spGames += 1;
        gameObject.enemyProfile.spLoses += 1;
        gameObject.enemyProfile.spGames += 1;
      }

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
              const player1WinsUrl = '../../audio/player1-wins.mp3';
              const playerWinsAudio = new Audio(player1WinsUrl);
              window.setTimeout(() => { playerWinsAudio.play(); }, 1000);
              this.props.history.push('/winnerscreen');
            }).catch((err) => {
              console.error('Failed to update online game: ', err);
            });
          } else {
            this.setState({gameObject: gameObject});
            const player1WinsUrl = '../../audio/player1-wins.mp3';
            const playerWinsAudio = new Audio(player1WinsUrl);
            window.setTimeout(() => { playerWinsAudio.play(); }, 1000);
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
        window.setTimeout(this.enemyAttack, 1300);
      }
    }
  };

  enemyAttack = () => {
    const {gameObject} = {...this.state};
    const {userRobot} = {...gameObject};
    const {enemyRobot} = {...gameObject};
    gameObject.specialUsed = false;
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
      enemyRobot.attackCount += 1;
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
    gameObject.attackDamage = damageDealt;
    gameObject.userRobot = userRobot;
    gameObject.enemyRobot = enemyRobot;
    if (userRobot.health <= 0) {
      if (this.props.onlinePlay) {
        gameObject.enemyProfile.olWins += 1;
        gameObject.enemyProfile.olGames += 1;
        gameObject.userProfile.olLoses += 1;
        gameObject.userProfile.olGames += 1;
      } else {
        gameObject.enemyProfile.spWins += 1;
        gameObject.enemyProfile.spGames += 1;
        gameObject.userProfile.spLoses += 1;
        gameObject.userProfile.spGames += 1;
      }

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
              const player2WinsUrl = '../../audio/player2-wins.mp3';
              const playerWinsAudio = new Audio(player2WinsUrl);
              window.setTimeout(() => { playerWinsAudio.play(); }, 1000);
              this.props.history.push('/winnerscreen');
            }).catch((err) => {
              console.error('Failed to update online game: ', err);
            });
          } else {
            this.setState({gameObject: gameObject});
            const player2WinsUrl = '../../audio/player2-wins.mp3';
            const playerWinsAudio = new Audio(player2WinsUrl);
            window.setTimeout(() => { playerWinsAudio.play(); }, 1000);
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

    // Determines the identity fo the player, whose turn it is and which key was pressed. Appropriate attack function is called if all criteria are met.
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
      // In single player mode the enemy attack logic is not needed here as it is called directly after the user attacks
      if ((this.state.gameObject.turn === 'user') && e.key === 'a') {
        this.userAttack(e);
      } else if ((this.state.gameObject.turn === 'user') && (e.key === 's') && (userRobot.attackCount >= userRobot.specialCount)) {
        this.useSpecialAttack();
      } else if ((this.state.gameObject.turn === 'user') && e.key === 'w') {
        this.userAttack(e);
      }
    }
  };

  displayDamage = () => {
    // Grabbing the attack damage from state and if attacking is true, displaying it by sending it into the AttackResult Component
    let displayDamage = [];
    if (this.state.gameObject.attacking) {
      displayDamage = <AttackResult attackDamage={this.state.gameObject.attackDamage} evaded={this.state.gameObject.evaded} isCritical={this.state.gameObject.isCritical}/>;
    } else {
      if (this.state.gameObject.turn === 'user') {
        displayDamage = <div><h2>Player 1 Start!</h2></div>;
      } else if (this.state.gameObject.turn === 'enemy') {
        displayDamage = <div><h2>Player 2 Start!</h2></div>;
      }
    }
    return displayDamage;
  };

  componentDidMount () {
    let gameObject = {};

    // Upon entering this component the below code checks to see if the game-play is single player or online play. If single player the gameObject in state is set from the local information in App's state based down to this component.
    if (!this.props.onlinePlay) {
      // sets locally scoped gameObject to the template in state, then adds all the required information to it from App
      gameObject = {...this.state.gameObject};
      gameObject.userProfile = {...this.props.userProfile};
      gameObject.enemyProfile = {...this.props.enemyProfile};
      gameObject.userRobot = {...this.props.userRobot};
      gameObject.enemyRobot = {...this.props.enemyRobot};
      gameObject.userStaticRobot = {...this.props.userRobot};
      gameObject.enemyStaticRobot = {...this.props.enemyRobot};

      // basicAttack is an imported file that defines .swing(). Each robot is having their basic attack added to them.
      gameObject.userRobot.swing = basicAttack.swing;
      gameObject.enemyRobot.swing = basicAttack.swing;

      // The two firebase transactions below are updating the most used section of the database with the currently selected robots.
      const userUsed = firebase.database().ref(`mostUsed/${gameObject.userRobot.id}/used`);
      userUsed.transaction(function (used) {
        return used + 1;
      });

      const enemyUsed = firebase.database().ref(`mostUsed/${gameObject.enemyRobot.id}/used`);
      enemyUsed.transaction(function (used) {
        return used + 1;
      });

      this.setState({gameObject: gameObject});
    } else if (this.props.onlinePlay) {
      const gameObjectId = this.props.currentOnlineMatch.id;

      // If online play make sure we have the most up to date online gameObject by grabbing it from firebase
      onlineMatchRequests.getCurrentOnlineMatch(gameObjectId).then((currentOnlineMatchObject) => {
        gameObject = currentOnlineMatchObject;
        const currentUserUid = firebase.auth().currentUser.uid;

        // Condition checking to see which profile (user or enemy) the local user is connected to. Updating the most used section of the database with their currently selected bot.
        if (currentUserUid === gameObject.userProfile.uid) {
          const userUsed = firebase.database().ref(`mostUsed/${gameObject.userRobot.id}/used`);
          userUsed.transaction(function (used) {
            return used + 1;
          });
        } else if (currentUserUid === gameObject.enemyProfile.uid) {
          const enemyUsed = firebase.database().ref(`mostUsed/${gameObject.enemyRobot.id}/used`);
          enemyUsed.transaction(function (used) {
            return used + 1;
          });
        }

        // Creating reference to firebase database, gameRef is the specific reference for the current online game.
        const rootRef = firebase.database();
        const gameRef = rootRef.ref('onlineMatches/' + gameObject.id);

        // setting up a listener on the game object in firebase. Any time data is changed on the gameObject in firebase, the entire object is sent back to the client with the updated data
        gameRef.on('value', (snapshot) => {
          const newGameObject = snapshot.val();

          // firebase does not store functions, so the attack functions on the bots no longer exist when data is sent back from firebase. One way around this is to add back the attack functions once you get the bots back from firebase. Another is to stringify the functions when updating firebase, and parse the strings when data is returned.
          newGameObject.userRobot.swing = basicAttack.swing;
          newGameObject.enemyRobot.swing = basicAttack.swing;

          // Adds correct special attack to the current robots from the imported specialAttack file.
          Object.keys(specialAttacks).forEach((key) => {
            if (key === newGameObject.userRobot.id) {
              newGameObject.userRobot.specialAttack = specialAttacks[key];
            } else if (key === newGameObject.enemyRobot.id) {
              newGameObject.enemyRobot.specialAttack = specialAttacks[key];
            }
          });

          // This if statement is needed for the losing player. Without checking the state of the firebase object that is returned after it's updated, the loser will not be pushed to the winnerscreen and unable to play again.

          // If the returned game object has a robot with less than or equal to 0 health, set the winner profile and bot, initialize winner audio and push to next component (WinnerScreen)
          if (newGameObject.userRobot.health <= 0) {
            this.props.setWinnerProfile(this.state.gameObject.enemyProfile);
            this.props.setWinnerBot(this.state.gameObject.enemyRobot);
            this.setState({gameObject: newGameObject});
            const player2WinsUrl = '../../audio/player2-wins.mp3';
            const playerWinsAudio = new Audio(player2WinsUrl);
            window.setTimeout(() => { playerWinsAudio.play(); }, 1000);
            this.props.history.push('/winnerscreen');
          } else if (newGameObject.enemyRobot.health <= 0) {
            this.props.setWinnerProfile(this.state.gameObject.userProfile);
            this.props.setWinnerBot(this.state.gameObject.userRobot);
            this.setState({gameObject: newGameObject});
            const player1WinsUrl = '../../audio/player1-wins.mp3';
            const playerWinsAudio = new Audio(player1WinsUrl);
            window.setTimeout(() => { playerWinsAudio.play(); }, 1000);
            this.props.history.push('/winnerscreen');
          } else {
            this.setState({gameObject: newGameObject});
          }
        });
      }).catch((err) => {
        console.error('Faield to get the online game object Fightarena componentDidMount: ', err);
      });
    }

    // Issue! Cannot send functions to firebase, will need to figure out a way to have the swing and special attacks added to the robots everytime
    window.addEventListener('keypress', this.attackFunction);
  };

  componentWillUnmount () {
    window.removeEventListener('keypress', this.attackFunction);
  };

  render () {
    const attackDamage = this.displayDamage();

    // Condition is determining if the game mode is online play or single player. If online play, only display the fight arena when both user and enemy robots have a name (are selected). Otherwise show waiting screen. If it is not online play the first condition evaluates to true and shows the fight arena right away.
    if (!this.props.onlinePlay || (this.state.gameObject.userRobot.name && this.state.gameObject.enemyRobot.name)) {
      return (
        <div className="FightArena">
          <div className='row attack-result'>
            <div className='col-xs-12'>
              <div className='col-xs-4 col-sm-offset-4 text-center'>
                {attackDamage}
              </div>
            </div>
          </div>
          <div className='row flex-arena'>
            <BattleBot attacking={this.state.gameObject.attacking} specialUsed={this.state.gameObject.specialUsed} turn={this.state.gameObject.turn} bot={this.state.gameObject.userRobot} staticBot={this.state.gameObject.userStaticRobot} />
            <BattleBot attacking={this.state.gameObject.attacking} specialUsed={this.state.gameObject.specialUsed} turn={this.state.gameObject.turn} bot={this.state.gameObject.enemyRobot} staticBot={this.state.gameObject.enemyStaticRobot} />
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
