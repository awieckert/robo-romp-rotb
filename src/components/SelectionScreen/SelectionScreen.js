import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import robotRequests from '../../firebaseRequests/robotRequests.js';
import SmallBot from '../SmallBot/SmallBot.js';
import LargeBot from '../LargeBot/LargeBot.js';
import specialAttacks from '../../specialAttacks.js';
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
    const toArena = () => {
      this.props.history.push('/fightarena');
    };

    window.setTimeout(toArena, 3000);
  };

  disableSmallBots = () => {
    this.setState({disableSmallBots: true});
  }

  setLargeBot = (selectedBot) => {
    this.setState({largeBot: selectedBot});
  };

  // I have the most up-to-date currentOnlineMatch coming into selectionScreen and being set in state that way we can update firebase from there.
  componentDidMount () {
    const {currentOnlineMatch} = {...this.props.currentOnlineMatch};
    const onlinePlay = this.props.onlinePlay;
    robotRequests.getRobots().then((robots) => {
      robots.forEach((robot) => {
        robot.specialAttack = specialAttacks[robot.id];
      });
      this.setState({allRobots: robots, onlinePlay: onlinePlay, currentOnlineMatch: currentOnlineMatch});
    }).catch((err) => {
      console.error('Could not get robots from firebase: ', err);
    });
  };

  componentDidUpdate () {
    if (this.state.disableSmallBots && this.state.onlinePlay) {
      // update the online game object, need to check which user I am so I know which profile and robot to update
      this.goToFightArena();
    }
    if (this.state.disableSmallBots && !this.state.completed) {
      const computerBots = [];
      const playerBot = {...this.state.largeBot};
      const allBots = [...this.state.allRobots];
      allBots.forEach((bot) => {
        if (bot.name !== playerBot.name) {
          bot.user = 'user2';
          computerBots.push(bot);
        }
      });
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
      this.goToFightArena();
    }
  }

  render () {
    return (
      <div className="SelectionScreen">
        <h1 className="SelectionScreen-title">SelectionScreen</h1>
        <LargeBot bot={this.state.largeBot} setUserRobot={this.props.setUserRobot} activeUser={this.props.activeUser} disableSmallBots={this.disableSmallBots} favoriteBots={this.props.favoriteBots} setCurrentOnlineMatch={this.props.setCurrentOnlineMatch} currentOnlineMatch={this.props.currentOnlineMatch}/>
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
