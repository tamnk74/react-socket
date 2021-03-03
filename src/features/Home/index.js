import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import socketIOClient from 'socket.io-client';
import io from 'socket.io-client';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import MessageList from './components/MessageList';

import { getMessages } from '../../store/messages/actions';
import './styles.scss';

const NEW_CHAT_MESSAGE_EVENT = 'new_message';
const ENDPOINT = 'http://localhost:3030/';

function App({ authenticated, auth }) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const { register, handleSubmit, reset, errors } = useForm();
  const onSubmit = (data) => {
    console.log(messages, data);
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, data);
  };
  const addNewMessage = (message) => {
    console.log(messages);
    setMessages((messages) => [...messages, message]);
    reset();
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
      console.log(socketRef.current);
      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, addNewMessage);
      socketRef.current.on('disconnect', () => {
        console.log(socketRef.current.id, socketRef.current.connected); // false
      });
      socketRef.current.on('set_id', (id) => {
        socketRef.current.id = id;
      });
      socketRef.current.on('set_user', ({ user }) => {
        socketRef.current.user = user;
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
  console.log('render', messages, socketRef.current);
  return (
    <div className="container chat-block">
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
                userId={socketRef.current && socketRef.current.user.id}
              />
            </ul>
            <section id="feedback"></section>
          </section>

          <section className="form-group">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="type_msg">
                <div className="input_msg_write">
                  <input
                    name="message"
                    className={classNames({
                      write_msg: true,
                      error: errors.message,
                    })}
                    type="text"
                    placeholder="Type a message"
                    ref={register({ required: true })}
                  />
                  <button className="msg_send_btn" type="submit">
                    <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </form>
          </section>
        </>
      )}
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
