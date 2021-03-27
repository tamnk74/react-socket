import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import MessageList from './components/MessageList';
import UserList from './components/UserList';
import RoomList from './components/RoomList';

import { getMessages } from '../../store/messages/actions';
import { SOCKET_URL } from '../../config';
import { events } from '../../constants';

import './styles.scss';

const NEW_CHAT_MESSAGE_EVENT = 'new_message';

function App({ authenticated, auth }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const socketRef = useRef();
  const { register, handleSubmit, reset, errors } = useForm();
  const onSubmit = (data) => {
    console.log(messages, data);
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, data);
  };
  const joinRoom = (room) => {
    socketRef.current.emit(events.JOIN_ROOM, {
      roomId: room.id,
    });
  };
  const joinUser = (user) => {
    socketRef.current.emit(events.JOIN_ROOM, {
      members: [socketRef.current.user.id, user.id],
    });
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
      console.log(socketRef);
      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, addNewMessage);
      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket');
      });
      socketRef.current.on('set_id', (id) => {
        socketRef.current.id = id;
      });
      socketRef.current.on(events.SET_USER, ({ user }) => {
        socketRef.current.user = user;
      });
      socketRef.current.on(events.SET_MESSAGES, (messages) => {
        setMessages(messages);
      });
      socketRef.current.on(events.SET_USERS, (users) => {
        console.log(users);
        setUsers(users);
      });
      socketRef.current.on(events.SET_ROOMS, (rooms) => {
        console.log('Rooms:  ', rooms);
        setRooms(rooms);
        if (!socketRef.current.room) {
          socketRef.current.room = rooms[0];
          socketRef.current.emit(events.JOIN_ROOM, {
            roomId: rooms[0].id,
          });
        }
      });

      socketRef.current.on(events.SET_ROOM, (room) => {
        console.log('Room:  ', room);
        socketRef.current.room = room;
      });
      socketRef.current.on('typing', () => {
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
            <RoomList rooms={rooms} handleJoinRoom={joinRoom} />
            <UserList users={users} handleJoinUser={joinUser} />
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
