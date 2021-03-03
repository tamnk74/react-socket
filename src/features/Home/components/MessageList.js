import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
const TIME_FORMAT = 'HH:mm | MMM D';
MessageList.propTypes = {
  messages: PropTypes.array,
  userId: PropTypes.string,
};

export default function MessageList({ messages, userId }) {
  console.log(messages, userId);
  return (
    <div className="msg_history">
      {messages.map((message) => {
        return message.user.id === userId ? (
          <div className="outgoing_msg" key={message.id}>
            <div className="sent_msg">
              <p>{message.message.message}</p>
              <span className="time_date">
                {dayjs(message.message.createdAt).format(TIME_FORMAT)}
              </span>{' '}
            </div>
          </div>
        ) : (
            <div className="incoming_msg" key={message.id}>
              <div className="incoming_msg_img">
                <img src={message.user.avatar} alt={message.user.name} />
              </div>
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p>{message.message.message}</p>
                  <span className="time_date">
                    {dayjs(message.message.createdAt).format(TIME_FORMAT)}
                  </span>
                </div>
              </div>
            </div>
          );
      })}
    </div>
  );
}
