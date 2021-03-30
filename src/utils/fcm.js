import { firebase } from '@firebase/app';
import 'firebase/messaging';
import { firebaseConfig } from '../config';

firebase.initializeApp(firebaseConfig);

export const messaging = firebase.messaging();
