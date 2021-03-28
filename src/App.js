import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import { Router } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from './utils';
import { Navbar } from './features/App/components/Navbar';
import Routers from './routers';
import Loading from './components/Loading';
import { getUserAction } from './store/auth/actions';
import { ToastContainer, toast } from 'react-toastify';
import { PermissionStatus } from './constants';
import { messaging } from './utils/fcm';

import 'react-toastify/dist/ReactToastify.css';
import './styles/app.scss';

class App extends Component {
  notify = (message) =>
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });

  async configFirebase() {
    const permission = await Notification.requestPermission();
    if (permission === PermissionStatus.granted) {
      console.log(`${permission} permission to notification`);
      const token = await messaging.getToken({
        vapidKey:
          'BJ1Q-WxmYrRC6heIlVIlh2mvRNHEkXsDh_eNut5vr1WGgXp7u4524MAARAHybhIq_XP0bngqQjymLnGbwp8yP7k',
      });
      console.log(token);
      // subscribeNotification({ deviceToken: token });
      // navigator.serviceWorker.addEventListener('message', (message) => {
      //   console.log(message);
      //   alert(message);
      // });
      messaging.onMessage((payload) => {
        console.log('Message received. ', payload);
        // ...
      });
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.props.getUser();
    }
    this.configFirebase();
  }

  render() {
    return (
      <div className="App">
        <Helmet titleTemplate="%s - Simple Chat" defaultTitle="Simple Chat">
          <meta name="description" content="A React.js blog application" />
        </Helmet>
        <ToastContainer />
        <Suspense fallback={<Loading />}>
          <Router history={history}>
            <Navbar />
            <Routers />
          </Router>
        </Suspense>
      </div>
    );
  }
}

App.propTypes = {
  getUser: PropTypes.func,
  errors: PropTypes.array,
  token: PropTypes.string,
};

const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(getUserAction()),
});

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App };
