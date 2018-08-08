import React from 'react';
import firebase from 'firebase';
import {Modal, Button} from 'react-bootstrap';
import './LoginModal.css';

class LoginModal extends React.Component {
  state = {
    userSignIn: {
      email: '',
      password: '',
    },
  };

  constructor (props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
    };
  }

  loginEmailInfo = (e) => {
    const userEmail = e.target.value;
    const userToSignIn = {...this.state.userSignIn};
    userToSignIn.email = userEmail;
    this.setState({userSignIn: userToSignIn});
  };

  loginPasswordInfo = (e) => {
    const userPassword = e.target.value;
    const userToSignIn = {...this.state.userSignIn};
    userToSignIn.password = userPassword;
    this.setState({userSignIn: userToSignIn});
  };

  signIn = () => {
    this.handleClose();
    firebase.auth().signInWithEmailAndPassword(this.state.userSignIn.email, this.state.userSignIn.password).then(() => {
      this.props.history.push('/gamemode');
    }).catch((err) => {
      console.error('Could not sign in user to firebase: ', err);
    });
  }

  handleClose () {
    this.setState({ show: false });
  }

  handleShow () {
    this.setState({ show: true });
  }

  componentDidMount () {
    window.addEventListener('keypress', (e) => {
      if ((e.charCode === 13) && this.state.userSignIn) {
        this.signIn();
      }
    });
  };

  componentWillUnmount () {
    window.removeEventListener('keypress', (e) => {
      if ((e.charCode === 13) && this.state.userSignIn) {
        this.signIn();
      }
    });
  };

  render () {

    return (
      <div>
        <Button bsSize="large" className='enter-fray-button bttn-unite bttn-md bttn-danger bttn-no-outline' onClick={this.handleShow}>
          Enter the Fray
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header closeButton>
            <Modal.Title className='myModal-title' id="contained-modal-title-lg">Join the Battle!</Modal.Title>
          </Modal.Header>
          {/* <Modal.Body> */}
          <div className='row modal-row'>
            <div className='col-xs-6 loginImg'>
            </div>
            <div className='col-xs-6 login-form'>
              <form className="form-horizontal">
                <div className="form-group">
                  <label htmlFor="inputEmail" className="col-xs-3 control-label myLabel">Email</label>
                  <div className="col-xs-8">
                    <input type="email" className="form-control" id="inputEmail" placeholder="Email" onChange={this.loginEmailInfo}></input>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="inputPassword" className="col-xs-3 control-label myLabel">Password</label>
                  <div className="col-xs-8">
                    <input type="password" className="form-control" id="inputPassword" placeholder="Password" onChange={this.loginPasswordInfo}></input>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* </Modal.Body> */}
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
            <Button bsStyle="primary" onClick={this.signIn}>Log in</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default LoginModal;
