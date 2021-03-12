import React from 'react';
import PropTypes from 'prop-types';

RoomList.propTypes = {
  rooms: PropTypes.array,
};

export default function RoomList({ rooms }) {
  return (
    <div className="user-list">
      {rooms.map((room) => (
        <div className="chat_list active_chat" key={room.id}>
          <div className="chat_people">
            <div className="chat_img">
              <h5>{room.name}</h5>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
