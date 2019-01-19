import React, { Component } from 'react';
import axios from 'axios';
import { sha256 } from 'js-sha256';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { withCookies } from 'react-cookie';
import { Col } from 'reactstrap';
import Tooltip from '../SharedComponents/Tooltip';
import Header from '../SharedComponents/Header';
import Footer from '../SharedComponents/MiniFooter';
import Loader from '../SharedComponents/Loader';
import { storeCredentials, storeEvents } from '../store/user/actions';
import { storeProjectSettings, storeEventMappings } from '../store/project/actions';
import shipperIcon from '../assets/images/role-avatars/shipper.svg';
import forwarderIcon from '../assets/images/role-avatars/forwarder.svg';
import customsIcon from '../assets/images/role-avatars/customs.svg';
import portIcon from '../assets/images/role-avatars/port.svg';
import '../assets/scss/loginPage.scss';
import config from '../config.json';

const roles = [
  {
    id: 'shipper',
    icon: shipperIcon,
    name: 'Shipper',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
  },
  {
    id: 'forwarder',
    icon: forwarderIcon,
    name: 'Forwarder',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
  },
  {
    id: 'customs',
    icon: customsIcon,
    name: 'Customs',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
  },
  {
    id: 'port',
    icon: portIcon,
    name: 'Port',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
  },
]

class LoginPage extends Component {
  state = {
    showLoader: false
  };

  componentDidMount() {
    const { cookies, loadEventMappings, loadProjectSettings } = this.props;
    loadProjectSettings();
    loadEventMappings();
    const tourStep = cookies.get('tourStep');
    if (!tourStep) {
      cookies.set('tourStep', 0, { path: '/' });
    }
  }

  loginAs = (event, role) => {
    const { cookies, history, storeCredentials, storeEvents } = this.props;
    event.preventDefault();
    this.setState({ showLoader: true });
    const password = sha256(role.toLowerCase());
    if (role === 'shipper' && Number(cookies.get('tourStep')) === 0) {
      cookies.set('tourStep', 1, { path: '/' });
    } else if (role === 'forwarder' && Number(cookies.get('tourStep')) === 9) {
      cookies.set('tourStep', 10, { path: '/' });
    }

    axios
      .post(`${config.rootURL}/login`, { username: role, password })
      .then(response => {
        storeCredentials(response.data);
        storeEvents(response.data.role);
        history.push('/list');
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
      <div className="login-page">
        <Header ctaEnabled>
          <Col xs={4} className="heading">
            <span className="heading-text">
              Log in to your user role
            </span>
          </Col>
        </Header>
        <div className="cta-wrapper">
          <a className="button" href="https://www.youtube.com/watch?v=Gr-LstcDcAw" target="_blank" rel="noopener noreferrer">
            Need help? Watch the video
          </a>
        </div>
        <div className="roles-wrapper">
          {
            roles.map(role => (
              <div className="role-wrapper" key={role.id}>
                <div className="role-icon">
                  <img alt={role.name} src={role.icon} />
                </div>
                <div className="role-info">
                  <div className="role-name">
                    {role.name}
                  </div>
                  <div className="role-description">
                    {role.description}
                  </div>
                  <div className="role-cta">
                    <button
                      className={`button ${role.id}-cta ${showLoader ? 'hidden' : ''}`}
                      onClick={event => this.loginAs(event, role.id)}
                    >
                      Log in
                    </button>
                    <Loader showLoader={showLoader} />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <Footer />
        <Tooltip />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadProjectSettings: () => dispatch(storeProjectSettings()),
  loadEventMappings: () => dispatch(storeEventMappings()),
  storeCredentials: credentials => dispatch(storeCredentials(credentials)),
  storeEvents: role => dispatch(storeEvents(role)),
});

export default connect(null, mapDispatchToProps)(withCookies(LoginPage));
