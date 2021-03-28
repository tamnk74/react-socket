// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: 'AIzaSyCFzbCR1REynUwxqKb7mxi966n-X9ZAsgs',
  authDomain: 'u-home-df61b.firebaseapp.com',
  projectId: 'u-home-df61b',
  storageBucket: 'u-home-df61b.appspot.com',
  messagingSenderId: '474914878568',
  appId: '1:474914878568:web:b3606cfc5f38b07e07f7dd',
  measurementId: 'G-HLKEETC3RG',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
