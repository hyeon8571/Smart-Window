importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDCwWOc37RDAPPe1TgRrxE0y07QzyI5fak",
  authDomain: "fcmtest-3a188.firebaseapp.com",
  projectId: "fcmtest-3a188",
  storageBucket: "fcmtest-3a188.appspot.com",
  messagingSenderId: "695828890468",
  appId: "1:695828890468:web:b0dcd66341d4c93926b071",
  measurementId: "G-2CR1VVP1WL"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});