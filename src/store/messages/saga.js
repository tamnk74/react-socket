import { put, call } from 'redux-saga/effects';
import { getMessages, createMessage } from './services';

import * as types from './constants';
import { history } from '../../utils/history';

export function* getMesagesSaga(options) {
  try {
    const response = yield call(getMessages, options.options);
    yield put({ type: types.SET_MESSAGES, posts: response });
  } catch (error) {
    yield put({ type: types.ERROR, error });
  }
}

export function* createMessageSage(options) {
  try {
    const post = yield call(createMessage, options.post);
    yield put({ type: types.SET_MESSAGE, post });
    history.push('/me/posts');
  } catch (error) {
    yield put({ type: types.ERROR, error });
  }
}
