import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import firebase from 'firebase';
import userRequests from '../../firebaseRequests/userRequests.js';
import './RegisterModal.css';

class RegisterModal extends React.Component {
  state = {
    show: false,
    registerProfile: {
      email: '',
      password: '',
    },
    userProfile: {
      email: '',
      username: '',
      uid: '',
      spWins: 0,
      spLoses: 0,
      olWins: 0,
      olLoses: 0,
      spGames: 0,
      olGames: 0,
      charUnlock1: false,
      charUnlock2: false,
      dmgDealt: 0,
    },
    favoriteBots: {
      uid: '',
      GoliathATV: 0,
      MerlinATV: 0,
      Gryphon: 0,
      Stinger: 0,
      CombatRogue: 0,
      AssassinationRogue: 0,
      PaladinDrone: 0,
      SuperAwesomeBot: 0,
    },
  };

  constructor (props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  registerEmailInfo = (e) => {
    const userEmail = e.target.value;
    const newRegisterProfile = {...this.state.registerProfile};
    newRegisterProfile.email = userEmail;
    this.setState({registerProfile: newRegisterProfile});
  };

  registerUserNameInfo = (e) => {
    const userName = e.target.value;
    const newUserProfile = {...this.state.userProfile};
    newUserProfile.username = userName;
    this.setState({userProfile: newUserProfile});
  };

  registerPasswordInfo = (e) => {
    const userPassword = e.target.value;
    const newRegisterProfile = {...this.state.registerProfile};
    newRegisterProfile.password = userPassword;
    this.setState({registerProfile: newRegisterProfile});
  };

  createUserAccount = () => {
    this.handleClose();
    firebase.auth().createUserWithEmailAndPassword(this.state.registerProfile.email, this.state.registerProfile.password).then((data) => {
      const newUserProfile = {...this.state.userProfile};
      newUserProfile.email = this.state.registerProfile.email;
      newUserProfile.uid = data.user.uid;
      this.setState({userProfile: newUserProfile});
      userRequests.createUser(this.state.userProfile).then(() => {
        const {favoriteBots} = {...this.state};
        favoriteBots.uid = data.user.uid;
        userRequests.createFavorites(favoriteBots).then(() => {
          this.props.history.push('/gamemode');
        }).catch((err) => {
          console.error('Failed to create favorites: ', err);
        });
      }).catch((err) => {
        console.error('Failed to create new user: ', err);
      });
    }).catch((err) => {
      console.error('Unable to register user with Firebase: ', err);
    });
  };

  handleClose () {
    this.setState({ show: false });
  }

  handleShow () {
    this.setState({ show: true });
  }

  render () {

    return (
      <div>
        <Button bsStyle="danger" bsSize="large" onClick={this.handleShow}>
          Join the Fight
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Battle Account Creation</Modal.Title>
          </Modal.Header>
          {/* <Modal.Body> */}
          <div className='row modal-row'>
            <div className='col-xs-6 registerImg'>
            </div>
            <div className='col-xs-6 register-form'>
              <form className="form-horizontal">
                <div className="form-group">
                  <label htmlFor="inputEmail" className="col-xs-3 control-label">Email</label>
                  <div className="col-xs-8">
                    <input type="email" className="form-control" id="inputEmail" placeholder="Email" onChange={this.registerEmailInfo}></input>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="inputUsername" className="col-xs-3 control-label">User Name</label>
                  <div className="col-xs-8">
                    <input type="userName" className="form-control" id="inputUsername" placeholder="User Name" onChange={this.registerUserNameInfo}></input>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="inputPassword" className="col-xs-3 control-label">Password</label>
                  <div className="col-xs-8">
                    <input type="password" className="form-control" id="inputPassword" placeholder="Password" onChange={this.registerPasswordInfo}></input>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* </Modal.Body> */}
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
            <Button bsStyle="primary" onClick={this.createUserAccount}>Create Account</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default RegisterModal;
