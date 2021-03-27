import React from 'react';
import PropTypes from 'prop-types';

RoomList.propTypes = {
  rooms: PropTypes.array,
  handleJoinRoom: PropTypes.func,
};

export default function RoomList({ rooms, handleJoinRoom }) {
  return (
    <div className="room-list">
      {rooms.map((room) => (
        <button
          className="btn btn-link room"
          key={room.id}
          onClick={() => handleJoinRoom(room)}
        >
          {room.name}
        </button>
      ))}
    </div>
  );
}
