import React from 'react';
import PropTypes from 'prop-types';

UserList.propTypes = {
  users: PropTypes.array,
};

export default function UserList({ users }) {
  return (
    <div className="user-list">
      {users.map((user) => (
        <div className="chat_list active_chat" key={user.id}>
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
      ))}
    </div>
  );
}
