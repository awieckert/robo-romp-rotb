import React, { Component } from 'react';
import RegisterModal from '../RegisterModal/RegisterModal.js';
import LoginModal from '../LoginModal/LoginModal.js';
import './Home.css';

class Home extends Component {

  goToRegister = () => {
    this.props.history.push('/register');
  };

  goToLogin = () => {
    this.props.history.push('/login');
  };

  render () {
    return (
      <div className="Home">
        <div className='container-fluid home-container'>
          <h1>Robo-Romp: Revenge of the Bots</h1>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='col-sm-8 col-xs-offset-2 enterFray'>
                <div className='vertical-align'>
                  <LoginModal history={this.props.history} />
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='col-sm-8 col-xs-offset-2 joinFight'>
                <div className='vertical-align'>
                  <RegisterModal history={this.props.history} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
