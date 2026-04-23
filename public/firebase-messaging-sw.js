
/**
 * @fileOverview عامل الخدمة الخاص بالإشعارات (Service Worker)
 * يقوم بمعالجة الرسائل الواردة في الخلفية وعرضها كإشعارات دفع.
 */

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCvrZDXFXTwXOvEx_tmx27fHDrqu_IrxWc",
  authDomain: "namix-app.firebaseapp.com",
  projectId: "namix-app",
  storageBucket: "namix-app.firebasestorage.app",
  messagingSenderId: "473838340529",
  appId: "1:473838340529:web:653ac06c4457f15fe69590"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received: ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
