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
import ReactNotification, { store } from 'react-notifications-component'

import 'react-notifications-component/dist/theme.css'
import './styles/app.scss';

class App extends Component {
  notify(message){
    store.addNotification({
      message,
    });
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.props.getUser();
    }
  }

  render() {
    return (
      <div className="App">
        <Helmet titleTemplate="%s - Simple Chat" defaultTitle="Simple Chat">
          <meta name="description" content="A React.js blog application" />
        </Helmet>
        <ReactNotification />
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
