import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { messaging } from '../../../utils/fcm';
import request from '../../../utils/request';
import {PermissionStatus} from '../../../constants';
import { logoutAction } from '../../../store/auth/actions';
import { store } from 'react-notifications-component';
import AdminLinks from './AdminLinks';

class SignedInLinks extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async configFirebase() {
    const permission = await Notification.requestPermission();
    if (permission === PermissionStatus.granted) {
      console.log(`${permission} permission to notification`);
      messaging.onMessage((payload) => {
        console.log('Fcm: ', payload);
        store.addNotification({
          title: payload.notification.title,
          message: payload.notification.body,
          type: "info",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
      });
      
    const token = await messaging.getToken({
      vapidKey:
        'BJ1Q-WxmYrRC6heIlVIlh2mvRNHEkXsDh_eNut5vr1WGgXp7u4524MAARAHybhIq_XP0bngqQjymLnGbwp8yP7k',
    });
    console.log('subscribe', token);
    return request.post('/api/me/subscribe', {
      token
    });
    }
  }

  componentDidMount() {
    this.configFirebase();
  }

  componentWillUnmount() {
    (async () => {
      const token = await messaging.getToken({
        vapidKey:
          'BJ1Q-WxmYrRC6heIlVIlh2mvRNHEkXsDh_eNut5vr1WGgXp7u4524MAARAHybhIq_XP0bngqQjymLnGbwp8yP7k',
      });
      console.log('subscribe', token);
    return request.post('/api/me/unsubscribe', {
      token
    });
    })();
  }

  handleLogout(e) {
    e.preventDefault();
    this.props.logout();
  }

  render() {
    const { user } = this.props;
    return (
      <ul className="navbar-nav navbar-right">
        {user.role == 'ADMIN' && <AdminLinks />}
        <li className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            id="navbarDropdownMenuLink"
            data-toggle="dropdown"
            role="button"
            aria-expanded="true"
          >
            {user.fullName} <span className="caret"></span>
          </a>
          <div
            className="dropdown-menu"
            aria-labelledby="navbarDropdownMenuLink"
            role="menu"
          >
            <NavLink to="/profile" className="dropdown-item">
              Profile
            </NavLink>
            <a onClick={this.handleLogout} href="#" className="dropdown-item">
              Logout
            </a>
          </div>
        </li>
      </ul>
    );
  }
}

SignedInLinks.propTypes = {
  logout: PropTypes.func,
  user: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logoutAction()),
});

const ConnectedSignedInLinks = connect(null, mapDispatchToProps)(SignedInLinks);
export { ConnectedSignedInLinks as SignedInLinks };
