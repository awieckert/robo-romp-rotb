import React, { Component } from 'react';
import robotRequests from '../../firebaseRequests/robotRequests.js';
import SmallBot from '../SmallBot/SmallBot.js';
import LargeBot from '../LargeBot/LargeBot.js';
import './SelectionScreen.css';

class SelectionScreen extends Component {
  state = {
    allRobots: [],
    largeBot: {},
    disableSmallBots: false,
  };

  disableSmallBots = () => {
    this.setState({disableSmallBots: true});
  }

  setLargeBot = (selectedBot) => {
    this.setState({largeBot: selectedBot});
  };

  componentDidMount () {
    robotRequests.getRobots().then((robots) => {
      this.setState({allRobots: robots});
    }).catch((err) => {
      console.error('Could not get robots from firebase: ', err);
    });
  };

  render () {
    let computerBot = '';
    if (this.state.disableSmallBots) {
      const computerBots = [];
      const playerBot = {...this.state.largeBot};
      const allBots = [...this.state.allRobots];
      allBots.forEach((bot) => {
        if (bot.name !== playerBot.name) {
          computerBots.push(bot);
        }
      });
      const randomBot = Math.floor(Math.random() * Math.floor(computerBots.length));
      const computerSelectedBot = computerBots[randomBot];
      computerSelectedBot.computer = true;
      computerBot = <LargeBot bot={computerSelectedBot} />;
    }
    return (
      <div className="SelectionScreen">
        <h1 className="SelectionScreen-title">SelectionScreen</h1>
        <LargeBot bot={this.state.largeBot} setUserRobot={this.props.setUserRobot} disableSmallBots={this.disableSmallBots}/>
        {computerBot}
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
