
/**
 * @fileOverview NAMIX BACKGROUND MESSAGING CORE v20.0
 * محرك الخلفية السيادي المسؤول عن استقبال التنبيهات حتى والتطبيق مغلق.
 */

importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCvrZDXFXTwXOvEx_tmx27fHDrqu_IrxWc",
  authDomain: "namix-app.firebaseapp.com",
  projectId: "namix-app",
  storageBucket: "namix-app.firebasestorage.app",
  messagingSenderId: "473838340529",
  appId: "1:473838340529:web:653ac06c4457f15fe69590"
});

const messaging = firebase.messaging();

// محرك معالجة الرسائل في الخلفية (Background Handler)
messaging.onBackgroundMessage((payload) => {
  console.log('[NAMIX SW] Background Message Received:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    image: payload.data?.image || null,
    tag: payload.data?.tag || 'namix-general',
    renotify: true,
    data: {
      url: payload.data?.url || '/home',
      priority: payload.data?.priority || 'medium'
    },
    // ميزة Action Buttons الاستراتيجية
    actions: [
      { action: 'open', title: '🔍 استكشاف الآن' },
      { action: 'close', title: 'تجاهل' }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// مستمع ضغط الإشعارات (Deep-Link Engine)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
