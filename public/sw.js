
/**
 * @fileOverview عامل الخدمة (Service Worker) الخاص بنظام ناميكس
 * يدير عرض الإشعارات والتفاعل معها وتوجيه المستخدم للروابط المطلوبة.
 */

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      dir: 'rtl',
      data: {
        url: data.data?.url || '/notifications'
      },
      actions: data.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  const notification = event.notification;
  const action = event.action;
  const targetUrl = notification.data.url;

  notification.close();

  if (action === 'dismiss') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
