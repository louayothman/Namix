// Namix Sovereign Service Worker v1.0
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // بروتوكول المرور المباشر لضمان جلب الأسعار اللحظية دون تخزين مؤقت معطل
  event.respondWith(fetch(event.request));
});