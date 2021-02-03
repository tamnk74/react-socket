import request from '../../utils/request';

export const getMessages = (options) => {
  return request.get('/api/messages', options);
};

export const createMessage = (message) => {
  return request.post('/api/messages', message);
};
