const CACHE_NAME = 'freestack-hub-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/dist/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/components/ItemCard.tsx',
  '/src/components/SearchBar.tsx',
  '/src/components/Sidebar.tsx',
  '/src/components/CategorySection.tsx',
  '/src/components/DarkModeToggle.tsx',
  '/src/components/ErrorBoundary.tsx',
  '/src/components/Sidebar.jsx',
  '/src/components/SearchBar.jsx',
  '/src/components/CategorySection.jsx',
  '/src/components/ItemCard.jsx',
  '/src/components/DarkModeToggle.jsx',
  '/src/components/ErrorBoundary.jsx',
  '/manifest.json',
  '/favicon.ico'
];

// Install service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});