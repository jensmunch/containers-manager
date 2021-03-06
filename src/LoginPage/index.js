import React, { Component } from 'react';
import axios from 'axios';
import { sha256 } from 'js-sha256';
import { connect } from 'react-redux';
import { TextField, SelectField, Button, FontIcon } from 'react-md';
import { toast } from 'react-toastify';
import { storeCredentials } from '../store/auth/actions';
import Logo from '../SharedComponents/Logo';
import Loader from '../SharedComponents/Loader';
import Notification from '../SharedComponents/Notification';
import config from '../config.json';
import '../assets/scss/loginPage.scss';

const ROLES = ['Shipper', 'Forwarder', 'Customs', 'Port', 'Observer'];

class LoginPage extends Component {
  state = {
    showLoader: false,
  };

  login = event => {
    event.preventDefault();
    this.setState({ showLoader: true });
    if (!this.username.value) return;

    const username = this.username.value.toLowerCase();
    const password = sha256(this.username.value.toLowerCase());

    axios
      .post(`${config.rootURL}/login`, { username, password })
      .then(response => {
        this.props.storeCredentials(response.data);
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({ showLoader: false });
        toast.error(
          error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : 'Authentication error'
        );
      });
  };

  render() {
    const { showLoader } = this.state;
    return (
      <div className="wrapper">
        <div className="graphic">
          <img src="desktop_bg.png" alt="background" className="background desktop" />
          <img src="tablet_bg.png" alt="background" className="background tablet" />
          <img src="mobile_bg.png" alt="background" className="background mobile" />
          <div className="welcome">
            <Logo />
            <p>Welcome back!</p>
            <p>Login to access container tracking</p>
          </div>
        </div>
        <div className="login">
          <form onSubmit={this.login}>
            <h3>Login</h3>
            <SelectField
              ref={username => (this.username = username)}
              id="username"
              required
              simplifiedMenu
              className="md-cell"
              placeholder="Select role"
              menuItems={ROLES}
              position={SelectField.Positions.BELOW}
              dropdownIcon={<FontIcon>expand_more</FontIcon>}
            />
            <TextField
              ref={password => (this.password = password)}
              id="password"
              label="Enter password"
              type="password"
              required
            />
            <Loader showLoader={showLoader} />
            <Button raised onClick={this.login} className={showLoader ? 'hidden' : ''}>
              Login
            </Button>
            <Notification />
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  storeCredentials: credentials => dispatch(storeCredentials(credentials)),
});

export default connect(null, mapDispatchToProps)(LoginPage);
