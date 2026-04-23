
/**
 * @fileOverview عامل الخدمة السيادي لناميكس v3.0 - Intelligent Routing Edition
 * يدير استقبال رسائل الدفع والتعامل مع نقرات المستخدم لتوجيهه للرابط المطلوب.
 */

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: {
        url: data.data?.url || '/home'
      },
      vibrate: [100, 50, 100],
      actions: data.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const urlToOpen = notification.data?.url || '/home';

  notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // البحث عن نافذة مفتوحة بالفعل للتطبيق
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // إذا لم يكن التطبيق مفتوحاً، نفتح نافذة جديدة بالرابط المطلوب
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// استراتيجية التخزين المؤقت لضمان العمل بدون إنترنت
const CACHE_NAME = 'namix-cache-v3';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/manifest.json', '/icon-192.png']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
