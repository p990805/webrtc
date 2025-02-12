// Vite + PWA를 위한 Service Worker 등록 파일
export function registerServiceWorker() {
    if (import.meta.env.MODE === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }
  
  export function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => console.error('Error unregistering service worker:', error));
    }
  }
  