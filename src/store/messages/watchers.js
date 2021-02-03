import { takeLatest } from 'redux-saga/effects';
import { getMesagesSaga } from './saga';

import * as types from './constants';

export default function* watchMEssageAction() {
  yield takeLatest(types.LIST_MESSAGES, getMesagesSaga);
}
