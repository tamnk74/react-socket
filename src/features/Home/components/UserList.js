import React from 'react';
import PropTypes from 'prop-types';

UserList.propTypes = {
  users: PropTypes.array,
  handleJoinUser: PropTypes.func,
};

export default function UserList({ users, handleJoinUser }) {
  return (
    <div className="user-list">
      {users.map((user) => (
        <button
          key={user.id}
          className="btn btn-link"
          onClick={() => handleJoinUser(user)}
        >
          <div className="chat_list active_chat">
            <div className="chat_people">
              <div className="chat_img">
                <img src={user.avatar} alt={user.name} width="40" height="40" />
              </div>
              <div className="chat_ib">
                <h5>{user.name}</h5>
                <p>Web developer</p>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
