import { combineReducers } from 'redux';
import app from '../features/App/store/reducer';
import auth from './auth/reducer';
import messages from './messages/reducer';

const rootReducer = combineReducers({
  app,
  auth,
  messages,
});

export default rootReducer;
