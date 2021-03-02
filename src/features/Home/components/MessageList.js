import React from 'react';
import PropTypes from 'prop-types';

MessageList.propTypes = {
  messages: PropTypes.object,
  socketId: PropTypes.string,
};

export default function MessageList({ messages, socketId }) {
  console.log(messages);
  return (
    <div className="msg_history">
      {messages.map((message) => {
        return message.socketId === socketId ? (
          <div className="outgoing_msg">
            <div className="sent_msg">
              <p>{message.message}</p>
              <span className="time_date"> 11:01 AM | Today</span>{' '}
            </div>
          </div>
        ) : (
          <div className="incoming_msg">
            <div className="incoming_msg_img">
              <img
                src="https://ptetutorials.com/images/user-profile.png"
                alt="sunil"
              />
            </div>
            <div className="received_msg">
              <div className="received_withd_msg">
                <p>{message.message}</p>
                <span className="time_date"> 11:01 AM | June 9</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
