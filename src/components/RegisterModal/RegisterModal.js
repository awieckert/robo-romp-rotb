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
      GoliathATV: {
        'id': 'GoliathATV',
        'name': 'Goliath-ATV',
        img: '../../img/goliath.jpg',
        used: 0,
      },
      MerlinATV: {
        'id': 'MerlinATV',
        'name': 'Merlin-ATV',
        img: '../../img/merlin.png',
        used: 0,
      },
      Gryphon: {
        'id': 'Gryphon',
        'name': 'Gryphon',
        img: '../../img/gryphon2.jpg',
        used: 0,
      },
      Stinger: {
        'id': 'Stinger',
        'name': 'Stinger',
        img: '../../img/stinger.jpg',
        used: 0,
      },
      CombatRogue: {
        'id': 'CombatRogue',
        'name': 'Combat-Rogue',
        img: '../../img/combat-rogue.jpg',
        used: 0,
      },
      AssassinationRogue: {
        'id': 'AssassinationRogue',
        'name': 'Assassinsation-Rogue',
        img: '../../img/assass-rogue.jpg',
        used: 0,
      },
      PaladinDrone: {
        'id': 'PaladinDrone',
        'name': 'Paladin-Drone',
        img: '../../img/bender.gif',
        used: 0,
      },
      SuperAwesomeBot: {
        id: 'SuperAwesomeBot',
        name: 'SuperAwesome-Bot',
        img: '../../img/awesomeo.jpeg',
        used: 0,
      },
    },
  };

  constructor (props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  registerEmailInfo = (e) => {
    // Function is triggered every time a keypress event happens in the email field. Sets state with the current value of that field
    const userEmail = e.target.value;
    const newRegisterProfile = {...this.state.registerProfile};
    newRegisterProfile.email = userEmail;
    this.setState({registerProfile: newRegisterProfile});
  };

  registerUserNameInfo = (e) => {
    // Function is triggered every time a keypress event happens in the username field. Sets state with the current value of that field
    const userName = e.target.value;
    const newUserProfile = {...this.state.userProfile};
    newUserProfile.username = userName;
    this.setState({userProfile: newUserProfile});
  };

  registerPasswordInfo = (e) => {
    // Function is triggered every time a keypress event happens in the password field. Sets state with the current value of that field
    const userPassword = e.target.value;
    const newRegisterProfile = {...this.state.registerProfile};
    newRegisterProfile.password = userPassword;
    this.setState({registerProfile: newRegisterProfile});
  };

  createUserAccount = () => {
    // Closes the modal and registers the user in firebase
    this.handleClose();
    firebase.auth().createUserWithEmailAndPassword(this.state.registerProfile.email, this.state.registerProfile.password).then((data) => {

      // Adds the uid and email address to the user Profile then sets state of the component with it.
      const newUserProfile = {...this.state.userProfile};
      newUserProfile.email = this.state.registerProfile.email;
      newUserProfile.uid = data.user.uid;
      this.setState({userProfile: newUserProfile});

      // Creates a new user object with userData in firebase then creates a new favorite bot collection in firebase for the new user.
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
    // Closes the modal
    this.setState({ show: false });
  }

  handleShow () {
    // Shows Modal
    this.setState({ show: true });
  }

  componentDidMount () {
    // Allows the use of enter keypress to log in. Must check the userSignIn so that this event is not fired elsewhere in the application
    window.addEventListener('keypress', (e) => {
      if ((e.charCode === 13) && this.state.registerProfile.email !== '') {
        this.createUserAccount();
      }
    });
  };

  componentWillUnmount () {
    // Removes the window event listener allowing for the use of eneter keypress to log in.
    window.removeEventListener('keypress', (e) => {
      if ((e.charCode === 13) && this.state.registerProfile.email !== '') {
        this.createUserAccount();
      }
    });
  };

  render () {

    return (
      <div>
        <Button bsSize='large' className='join-fight-button bttn-unite bttn-md bttn-danger bttn-no-outline' onClick={this.handleShow}>
          Join the Fight
        </Button>

        <Modal className='RegisterModal' show={this.state.show} onHide={this.handleClose} bsSize='large' aria-labelledby='contained-modal-title-lg'>
          <Modal.Header closeButton>
            <Modal.Title className='myModal-title' id='contained-modal-title-lg'>Battle Account Creation</Modal.Title>
          </Modal.Header>
          {/* <Modal.Body> */}
          <div className='row modal-row'>
            <div className='col-xs-6 registerImg'>
            </div>
            <div className='col-xs-6 register-form'>
              <form className='form-horizontal'>
                <div className='form-group'>
                  <label htmlFor='inputEmail' className='col-xs-3 control-label myLabel'>Email</label>
                  <div className='col-xs-8'>
                    <input type='email' className='form-control' id='inputEmail' placeholder='Email' onChange={this.registerEmailInfo}></input>
                  </div>
                </div>
                <div className='form-group'>
                  <label htmlFor='inputUsername' className='col-xs-3 control-label myLabel'>User Name</label>
                  <div className='col-xs-8'>
                    <input type='userName' className='form-control' id='inputUsername' placeholder='User Name' onChange={this.registerUserNameInfo}></input>
                  </div>
                </div>
                <div className='form-group'>
                  <label htmlFor='inputPassword' className='col-xs-3 control-label myLabel'>Password</label>
                  <div className='col-xs-8'>
                    <input type='password' className='form-control' id='inputPassword' placeholder='Password' onChange={this.registerPasswordInfo}></input>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* </Modal.Body> */}
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
            <Button bsStyle='primary' onClick={this.createUserAccount}>Create Account</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default RegisterModal;
