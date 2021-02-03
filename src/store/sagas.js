import { all, fork } from 'redux-saga/effects';
import watchUserAuthentication from './auth/watchers';
import watchPost from './messages/watchers';
import appWatcher from '../features/App/store/watchers';

export default function* startForman() {
  yield all([fork(watchUserAuthentication), fork(watchPost), fork(appWatcher)]);
}
