import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import './RegisterModal.css';

class RegisterModal extends React.Component {
  state = {
    show: false,
    userProfile: {
      email: '',
      username: '',
      uid: '',
      spWins: 0,
      spLoses: 0,
      olWins: 0,
      olLoses: 1,
      spGames: 0,
      olGames: 0,
      charUnlock1: false,
      charUnlock2: false,
      dmgDealt: 0,
    },
  };

  constructor (props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    // this.state = {
    //   show: false,
    // };
  }

  registerEmailInfo = (e) => {
    const userEmail = e.target.value;
    const newUserProfile = {...this.state.userProfile};
    newUserProfile.email = userEmail;
    this.setState({userProfile: newUserProfile});
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
                    <input type="userName" className="form-control" id="inputUsername" placeholder="User Name"></input>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="inputPassword" className="col-xs-3 control-label">Password</label>
                  <div className="col-xs-8">
                    <input type="password" className="form-control" id="inputPassword" placeholder="Password"></input>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* </Modal.Body> */}
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
            <Button bsStyle="primary" onClick={this.handleClose}>Create Account</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default RegisterModal;
