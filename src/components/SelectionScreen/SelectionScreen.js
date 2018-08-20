import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import robotRequests from '../../firebaseRequests/robotRequests.js';
import SmallBot from '../SmallBot/SmallBot.js';
import LargeBot from '../LargeBot/LargeBot.js';
import specialAttacks from '../../specialAttacks.js';
import onlineMatchRequests from '../../firebaseRequests/onlineMatchRequests.js';
import './SelectionScreen.css';

class SelectionScreen extends Component {
  state = {
    allRobots: [],
    largeBot: {},
    computerBot: {},
    currentOnlineMatch: {},
    disableSmallBots: false,
    completed: false,
    onlinePlay: false,
  };

  goToFightArena = () => {
    // Function that is called to push users to the fight arena screen. Occurs after both user and computer have selected in single player or once a user has selected during online play. Pauses the background music and starts the count down audio.
    this.props.pauseBackgroundAudio();
    const {countDownAudio} = {...this.props};
    countDownAudio.play();
    const toArena = () => {
      this.props.history.push('/fightarena');
    };

    window.setTimeout(toArena, 7500);
  };

  disableSmallBots = () => {
    // Sets a flag in state that is used to toggle the ability to select a new robot. If disabledSmallBots is true, user cannot select anymore.
    this.setState({disableSmallBots: true});
  }

  setLargeBot = (selectedBot) => {
    // Sets the components state with the information for the selected bot.
    this.setState({largeBot: selectedBot});
  };

  // I have the most up-to-date currentOnlineMatch coming into selectionScreen and being set in state that way we can update firebase from there.
  componentDidMount () {
    // Grabbing the most recent version of the online game object from firebase. This is needed because you cannot be sure which user selects first.
    const {currentOnlineMatch} = {...this.props};
    onlineMatchRequests.getCurrentOnlineMatch(currentOnlineMatch.id).then((onlineMatch) => {
      // Sets the flag in state of onlinePlay to true. This is used as a distinguisher throughout the application. Functionality depends on single vs online play.
      const onlinePlay = this.props.onlinePlay;
      robotRequests.getRobots().then((robots) => {
        // Need to add the special attack functions to each robot, because this data cannot be stored in firebase.
        robots.forEach((robot) => {
          robot.specialAttack = specialAttacks[robot.id];
        });
        this.setState({allRobots: robots, onlinePlay: onlinePlay, currentOnlineMatch: onlineMatch});
      }).catch((err) => {
        console.error('Could not get robots from firebase: ', err);
      });
    }).catch((err) => {
      console.error('Failed to get current online match in selection screen: ', err);
    });

  };

  componentDidUpdate () {
    if (this.state.disableSmallBots && this.state.onlinePlay) {
      // Pushes user to the fight arena if they are in an online game
      this.goToFightArena();
    }
    if ((this.state.disableSmallBots && !this.state.completed) && !this.state.onlinePlay) {

      // If statement is verifying that the game mode is single player, that user1 has selected and the computer has not selected
      // disableSmallBots because true when user1 confirms bot selection, completed because true when both user and computer have selected, onlinePlay is false when single player game is selected
      const computerBots = [];
      const playerBot = {...this.state.largeBot};
      const allBots = [...this.state.allRobots];
      allBots.forEach((bot) => {
        // creates and array of bots for the computer to select. Will not include the bot selected by user1
        if (bot.name !== playerBot.name) {
          bot.user = 'user2';
          computerBots.push(bot);
        }
      });

      // Randomly selects one of the computer bots from the array and passes it to the largeBot component.
      const randomBot = Math.floor(Math.random() * Math.floor(computerBots.length));
      const computerSelectedBot = computerBots[randomBot];
      computerSelectedBot.computer = true;
      const computerBotComponent = <LargeBot bot={computerSelectedBot} />;
      ReactDOM.render(computerBotComponent, document.getElementById('computerRobot'));
      this.setState({computerBot: computerSelectedBot});
      this.props.setEnemyRobot(computerSelectedBot);
      this.setState({completed: true});
    }

    if (this.state.completed) {
      // Once the computer has selected, completed is set to true in state and this code runs, pushing the user and computer to the fight arena.
      this.goToFightArena();
    }
  }

  render () {
    return (
      <div className="SelectionScreen">
        <h1 className="SelectionScreen-title">Select Your Bot</h1>
        <LargeBot bot={this.state.largeBot} setUserRobot={this.props.setUserRobot} activeUser={this.props.activeUser} disableSmallBots={this.disableSmallBots} favoriteBots={this.props.favoriteBots} setCurrentOnlineMatch={this.props.setCurrentOnlineMatch} currentOnlineMatch={this.props.currentOnlineMatch} onlinePlay={this.props.onlinePlay}/>
        <div id='computerRobot'></div>
        <div className='row navbar-fixed-bottom'>
          <div className='col-xs-12 row'>
            <SmallBot bots={this.state.allRobots} setLargeBot={this.setLargeBot} smallBotsDisabled={this.state.disableSmallBots} />
          </div>
        </div>
      </div>
    );
  }
}

export default SelectionScreen;
