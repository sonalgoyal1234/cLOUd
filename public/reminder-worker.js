// public/reminder-worker.js

self.addEventListener("install", () => {
  console.log("Service Worker installed for Smart Reminders ✅");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated 🩵");
  return self.clients.claim();
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});