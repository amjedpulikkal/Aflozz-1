self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: 'your-notification-icon.png', // Replace with the URL to your notification icon
        badge: 'your-notification-badge.png', // Replace with the URL to your notification badge
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    // Add custom logic to handle notification click, e.g., open a specific URL
    clients.openWindow('https://example.com');
});

self.addEventListener('notificationclose', (event) => {
    // Add custom logic to handle notification close, if needed
    console.log('Notification closed:', event);
});
