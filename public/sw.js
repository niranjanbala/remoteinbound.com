// Remote Inbound Service Worker
// Provides offline functionality and caching for PWA

const CACHE_NAME = 'remoteinbound-v1.0.0';
const STATIC_CACHE = 'remoteinbound-static-v1.0.0';
const DYNAMIC_CACHE = 'remoteinbound-dynamic-v1.0.0';
const API_CACHE = 'remoteinbound-api-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/offline',
  // Core pages
  '/register',
  '/login',
  '/dashboard',
  '/events',
  '/speakers',
  '/admin/login',
  // Static assets will be handled by Next.js automatically
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/users',
  '/api/events',
  '/api/speakers'
];

// Network timeout for fetch requests
const NETWORK_TIMEOUT = 5000;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - network first with cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith('/_next/static/')) {
    // Static assets - cache first
    event.respondWith(handleStaticAssets(request));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    // Other static files - cache first
    event.respondWith(handleStaticAssets(request));
  } else {
    // HTML pages - network first with cache fallback
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    // Try network first with timeout
    const networkResponse = await fetchWithTimeout(request, NETWORK_TIMEOUT);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for API request, trying cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This feature requires an internet connection',
        offline: true 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch static asset:', request.url);
    // Return a fallback for images
    if (request.url.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
      return new Response('', { status: 404 });
    }
    throw error;
  }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    // Try network first
    const networkResponse = await fetchWithTimeout(request, NETWORK_TIMEOUT);
    
    // Cache successful HTML responses
    if (networkResponse.ok && networkResponse.headers.get('content-type')?.includes('text/html')) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for page request, trying cache:', request.url);
    
    // Try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/offline');
      if (offlineResponse) {
        return offlineResponse;
      }
      
      // Fallback offline page
      return new Response(
        createOfflinePage(),
        {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }
    
    throw error;
  }
}

// Fetch with timeout
function fetchWithTimeout(request, timeout) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Network timeout'));
    }, timeout);
    
    fetch(request)
      .then((response) => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Create offline page HTML
function createOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Remote Inbound</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          text-align: center;
          padding: 2rem;
          max-width: 500px;
        }
        .logo {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          font-size: 2rem;
          font-weight: bold;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          line-height: 1.6;
        }
        .button {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-block;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 1rem;
        }
        .button:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }
        .features {
          margin-top: 3rem;
          text-align: left;
        }
        .feature {
          margin-bottom: 1rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .feature:last-child {
          border-bottom: none;
        }
        .feature-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .feature-desc {
          font-size: 0.9rem;
          opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">RI</div>
        <h1>You're Offline</h1>
        <p>Don't worry! Remote Inbound works offline too. You can still access cached content and use many features without an internet connection.</p>
        
        <button class="button" onclick="window.location.reload()">
          Try Again
        </button>
        
        <div class="features">
          <div class="feature">
            <div class="feature-title">✓ Browse Cached Events</div>
            <div class="feature-desc">View previously loaded event information</div>
          </div>
          <div class="feature">
            <div class="feature-title">✓ Access Your Dashboard</div>
            <div class="feature-desc">Check your registered events and profile</div>
          </div>
          <div class="feature">
            <div class="feature-title">✓ Local Registration</div>
            <div class="feature-desc">Register for events (syncs when online)</div>
          </div>
          <div class="feature">
            <div class="feature-title">✓ Speaker Profiles</div>
            <div class="feature-desc">Browse cached speaker information</div>
          </div>
        </div>
      </div>
      
      <script>
        // Auto-retry when online
        window.addEventListener('online', () => {
          window.location.reload();
        });
        
        // Show online/offline status
        function updateOnlineStatus() {
          if (navigator.onLine) {
            window.location.reload();
          }
        }
        
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
      </script>
    </body>
    </html>
  `;
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Perform background sync
async function doBackgroundSync() {
  console.log('[SW] Performing background sync...');
  
  try {
    // Sync any pending data from localStorage
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        message: 'Syncing data...'
      });
    });
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Remote Inbound', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('[SW] Service worker loaded successfully');