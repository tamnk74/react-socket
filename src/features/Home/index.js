import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

import { getMessages } from '../../store/messages/actions';

const ENDPOINT = 'http://127.0.0.1:3600';

function App({ authenticated, auth, messages }) {
  useEffect(() => {
    if (authenticated) {
      const socket = io(ENDPOINT, {
        auth: {
          token: auth.token,
        },
      });
      socket.on('FromAPI', (data) => {});
    }
  }, [authenticated]);
  console.log(auth);
  return (
    <div className="jumbotron text-center">
      <div className="container">
        <h1>Super Chat</h1>
        {!authenticated ? (
          <section className="row">
            <Link to="/login" className="btn">
              Please login to join the chat room
            </Link>
          </section>
        ) : (
          <>
            <section id="chatroom" className="row">
              <ul className="list-group" id="chatcontent">
                {messages.length ? (
                  messages.map((message) => (
                    <li className="list-group-item" key={message}>
                      {message}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">Add your message !</li>
                )}
              </ul>
              <section id="feedback"></section>
            </section>

            <section className="row form-group">
              <div className="col-sm-10">
                <input id="message" className="form-control" type="text" />
              </div>
              <button
                id="send_message"
                className="btn btn-success col-sm-2"
                type="button"
              >
                Send
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

App.propTypes = {
  auth: PropTypes.object,
  messages: PropTypes.array,
  authenticated: PropTypes.bool,
  getMessages: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  authenticated: !!state.auth.user,
  messages: state.messages.items || [],
});

const mapDispatchToProps = (dispatch) => ({
  getMessages: (options) => dispatch(getMessages(options)),
});

const connectedHomePage = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedHomePage as HomePage };
