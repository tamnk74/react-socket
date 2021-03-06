import produce from 'immer';
import * as types from './constants';

// The initial state of the App
export const initialState = {
  messages: [],
};

const postReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.SET_MESSAGES:
        draft.items = action.messages;
        break;
      case types.ERROR:
        draft.error = action.error;
        break;
    }
  });

export default postReducer;
