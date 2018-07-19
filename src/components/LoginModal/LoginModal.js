import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import './LoginModal.css';

class LoginModal extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
    };
  }

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
            <div className='col-xs-6 loginImg'>
            </div>
            <div className='col-xs-6 login-form'>
              <form className="form-horizontal">
                <div className="form-group">
                  <label htmlFor="inputEmail" className="col-xs-3 control-label">Email</label>
                  <div className="col-xs-8">
                    <input type="email" className="form-control" id="inputEmail" placeholder="Email"></input>
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
            <Button bsStyle="primary" onClick={this.handleClose}>Log in</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default LoginModal;
