import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import MessageList from './components/MessageList';
import UserList from './components/UserList';

import { getMessages } from '../../store/messages/actions';
import { SOCKET_URL } from '../../config';

import './styles.scss';

const NEW_CHAT_MESSAGE_EVENT = 'new_message';

function App({ authenticated, auth }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
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
    if (authenticated) {
      console.log('Start connect to socket', SOCKET_URL);
      socketRef.current = io(SOCKET_URL, {
        query: {
          token: auth.token,
        },
      });
      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, addNewMessage);
      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket');
      });
      socketRef.current.on('set_id', (id) => {
        socketRef.current.id = id;
      });
      socketRef.current.on('set_user', ({ user }) => {
        socketRef.current.user = user;
      });
      socketRef.current.on('set_messages', (messages) => {
        setMessages(messages);
      });
      socketRef.current.on('set_users', (users) => {
        setUsers(users);
      });
      socketRef.current.on('typing', (data) => {
        console.log('Someone is typing');
      });
    }
    return () => {
      socketRef.current && socketRef.current.disconnect();
      console.log('Disconnected to socket');
    };
  }, [authenticated]);

  return (
    <div className="chat-block">
      {!authenticated ? (
        <section className="row">
          <Link to="/login" className="btn">
            Please login to join the chat room
          </Link>
        </section>
      ) : (
        <div className="row">
          <div className="col-md-4 border">
            <UserList users={users} />
          </div>
          <div className="col-md-8">
            <section id="chatroom" className="row">
              <ul className="list-group">
                <MessageList
                  messages={messages}
                  userId={
                    socketRef.current &&
                    socketRef.current.user &&
                    socketRef.current.user.id
                  }
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
          </div>
        </div>
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
