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
    return (
      <div className="SelectionScreen">
        <h1 className="SelectionScreen-title">SelectionScreen</h1>
        <LargeBot bot={this.state.largeBot} setUserRobot={this.props.setUserRobot} disableSmallBots={this.disableSmallBots}/>
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
