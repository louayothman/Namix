
/**
 * @fileOverview NAMIX SERVICE WORKER v2.0
 * محرك البث المباشر لشاشة القفل والتوجيه الذكي.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) return;

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'تنبيه جديد', body: event.data.text() };
    }
  }

  const options = {
    body: data.body || data.message || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    dir: 'rtl',
    data: {
      url: data.url || '/home'
    },
    tag: data.tag || 'namix_notification',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'ناميكس', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // إذا كان التطبيق مفتوحاً، توجه للرابط المطلوب
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // إذا كان مغلقاً، افتحه وتوجه للرابط
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
