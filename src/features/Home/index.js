import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import socketIOClient from 'socket.io-client';
import io from 'socket.io-client';
import { useForm } from 'react-hook-form';
import MessageList from './components/MessageList';

import { getMessages } from '../../store/messages/actions';
import './styles.scss';

const NEW_CHAT_MESSAGE_EVENT = 'new_message';
const ENDPOINT = 'http://localhost:3030/';

function App({ authenticated, auth }) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    console.log(messages, data);
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, data);
  };
  const addNewMessage = (message) => {
    console.log(messages);
    setMessages((messages) => [...messages, message]);
  };
  useEffect(() => {
    console.log('useEffect');
    if (authenticated) {
      console.log('start connect', auth.token);
      socketRef.current = io(ENDPOINT, {
        query: {
          token: auth.token,
        },
      });
      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, addNewMessage);
      socketRef.current.on('disconnect', () => {
        console.log(socketRef.current.id, socketRef.current.connected); // false
      });
      socketRef.current.on('set_id', (id) => {
        console.log('socket id', id, socketRef.current.id); // false
      });
      socketRef.current.on('typing', (data) => {
        console.log('Typing', data.username); // false
      });
    }
    return () => {
      socketRef.current && socketRef.current.disconnect();
      console.log('Disconnected to socket');
    };
  }, [authenticated]);
  console.log('render', messages);
  return (
    <div className="jumbotron text-center">
      <div className="container">
        <h1>-__-</h1>
        {!authenticated ? (
          <section className="row">
            <Link to="/login" className="btn">
              Please login to join the chat room
            </Link>
          </section>
        ) : (
            <>
              <section id="chatroom" className="row">
                <ul className="list-group">
                  <MessageList
                    messages={messages}
                    socketId={socketRef.current && socketRef.current.id}
                  />
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
