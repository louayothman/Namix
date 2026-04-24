
/**
 * NAMIX SERVICE WORKER v1.0
 * يتولى مهام استلام إشعارات Push والتعامل مع النقر عليها للتوجيه داخل التطبيق.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
  if (event.data) {
    const payload = event.data.json();
    event.waitUntil(
      self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon || '/icon-192.png',
        badge: '/icon-192.png',
        data: payload.data,
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // استخراج الرابط من بيانات الإشعار
  const targetUrl = event.notification.data?.url || '/home';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      // إذا كان التطبيق مفتوحاً، قم بالتركيز عليه وتوجيهه
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // إذا لم يكن مفتوحاً، قم بفتحه على الرابط المطلوب
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
