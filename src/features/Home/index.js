import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { useForm } from 'react-hook-form';

import { getMessages } from '../../store/messages/actions';

const ENDPOINT = 'http://127.0.0.1:3000';
const NEW_CHAT_MESSAGE_EVENT = 'new_message';

function App({ authenticated, auth }) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    console.log(data, socketRef.current);
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, data);
  };
  useEffect(() => {
    console.log('useEffect');
    // if (authenticated) {
    console.log(auth.token);
    socketRef.current = socketIOClient(ENDPOINT, {
      query: {
        token: auth.token,
      },
    });
    console.log('Connected to socket', socketRef.current);
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      setMessages((messages) => [...messages, message]);
    });
    socketRef.current.on('disconnect', () => {
      console.log(socketRef.current.connected); // false
    });
    // }
    return () => {
      socketRef.current && socketRef.current.disconnect();
      console.log('Disconnected to socket');
    };
  }, [authenticated]);
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

            <section className="form-group">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-sm-10">
                    <input
                      name="message"
                      className="form-control"
                      type="text"
                      ref={register({ required: true })}
                    />
                    {errors.message && <span>This field is required</span>}
                  </div>
                  <button
                    id="send_message"
                    className="btn btn-success col-sm-2"
                    type="submit"
                  >
                    Send
                  </button>
                </div>
              </form>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

App.propTypes = {
  auth: PropTypes.object,
  authenticated: PropTypes.bool,
  getMessages: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  authenticated: !!state.auth.user && !!state.auth.token,
});

const mapDispatchToProps = (dispatch) => ({
  getMessages: (options) => dispatch(getMessages(options)),
});

const connectedHomePage = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedHomePage as HomePage };
