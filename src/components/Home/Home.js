import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  render () {
    return (
      <div className="Home">
        <div className='container-fluid home-container'>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='col-sm-10 col-xs-offset-1 enterFray'>
                <div className='vertical-align'>
                  <button className='btn btn-danger'>Enter the Fray</button>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='col-sm-10 col-xs-offset-1 joinFight'>
                <div className='vertical-align'>
                  <button className='btn btn-danger'>Join the Fight</button>
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
