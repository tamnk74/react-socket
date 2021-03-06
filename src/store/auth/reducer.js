import produce from 'immer';
import * as types from './constants';
import axios from 'axios';

const token = localStorage.getItem('token');
const initialState = token ? { token, user: null } : { user: null };
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

const authReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.SET_USER:
        draft.user = action.user;
        draft.token = localStorage.getItem('token');
        break;
      case types.REMOVE_USER:
        draft.user = null;
        break;
      case types.ERROR:
        draft.error = action.error;
        break;
      default:
        return;
    }
  });

export default authReducer;
