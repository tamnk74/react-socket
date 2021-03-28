import { firebase } from '@firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyCFzbCR1REynUwxqKb7mxi966n-X9ZAsgs',
  authDomain: 'u-home-df61b.firebaseapp.com',
  projectId: 'u-home-df61b',
  storageBucket: 'u-home-df61b.appspot.com',
  messagingSenderId: '474914878568',
  appId: '1:474914878568:web:b3606cfc5f38b07e07f7dd',
  measurementId: 'G-HLKEETC3RG',
};

firebase.initializeApp(firebaseConfig);

export const messaging = firebase.messaging();
