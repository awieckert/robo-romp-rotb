import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import './RegisterModal.css';

class RegisterModal extends React.Component {
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
            <div className='col-xs-6 registerImg'>
            </div>
            <div className='col-xs-6 register-form'>
              <h4>Text in a modal</h4>
              <p>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </p>

              <h4>Popover in a modal</h4>

              <h4>Tooltips in a modal</h4>

              <h4>Overflowing text to show scroll behavior</h4>
              <p>
                Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
                ac consectetur ac, vestibulum at eros.
              </p>
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
