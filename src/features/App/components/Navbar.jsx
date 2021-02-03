import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { SignedInLinks } from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';
import { setQuery } from '../store/actions';

class Navbar extends React.Component {
  handleChangeQuery = (e) => {
    this.props.setQuery(e.target.value);
  };

  render() {
    const { auth } = this.props;
    return (
      <nav className="navbar navbar-default navbar-static-topnavbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#app-navbar-collapse"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link to="/" className="navbar-brand">
            Chat App
          </Link>
          <div className="collapse navbar-collapse" id="app-navbar-collapse">
            {auth.user ? (
              <SignedInLinks user={auth.user} />
            ) : (
              <SignedOutLinks />
            )}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  auth: PropTypes.object,
  setQuery: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  setQuery: (query) => dispatch(setQuery(query)),
});

const connectedNavbar = connect(mapStateToProps, mapDispatchToProps)(Navbar);
export { connectedNavbar as Navbar };
