import * as types from './constants';

export const getMessages = (options) => {
  return {
    type: types.LIST_MESSAGES,
    options,
  };
};
