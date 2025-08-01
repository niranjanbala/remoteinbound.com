// PWA utilities for service worker registration and installation
import React from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private isStandalone = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Check if app is already installed
    this.checkInstallationStatus();

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] beforeinstallprompt event fired');
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.showInstallButton();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App was installed');
      this.isInstalled = true;
      this.hideInstallButton();
      this.deferredPrompt = null;
    });

    // Register service worker
    this.registerServiceWorker();
  }

  private checkInstallationStatus() {
    // Check if running in standalone mode (installed PWA)
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;

    // Check if service worker is registered (indication of PWA capability)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        this.isInstalled = registrations.length > 0 && this.isStandalone;
      });
    }

    console.log('[PWA] Installation status:', {
      isStandalone: this.isStandalone,
      isInstalled: this.isInstalled
    });
  }

  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service workers not supported');
      return null;
    }

    try {
      console.log('[PWA] Registering service worker...');
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[PWA] Service worker registered successfully:', registration);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        console.log('[PWA] New service worker found');
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New service worker installed, showing update prompt');
              this.showUpdatePrompt();
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('[PWA] Message from service worker:', event.data);
        
        if (event.data.type === 'BACKGROUND_SYNC') {
          this.handleBackgroundSync(event.data.message);
        }
      });

      return registration;
    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
      return null;
    }
  }

  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('[PWA] No deferred prompt available');
      return false;
    }

    try {
      console.log('[PWA] Showing install prompt');
      await this.deferredPrompt.prompt();
      
      const choiceResult = await this.deferredPrompt.userChoice;
      console.log('[PWA] User choice:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        this.deferredPrompt = null;
        return true;
      } else {
        console.log('[PWA] User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Error showing install prompt:', error);
      return false;
    }
  }

  private showInstallButton() {
    // Dispatch custom event to show install button
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  }

  private hideInstallButton() {
    // Dispatch custom event to hide install button
    window.dispatchEvent(new CustomEvent('pwa-install-completed'));
  }

  private showUpdatePrompt() {
    // Show update notification
    const updateAvailable = new CustomEvent('pwa-update-available');
    window.dispatchEvent(updateAvailable);
  }

  private handleBackgroundSync(message: string) {
    console.log('[PWA] Background sync:', message);
    // Handle background sync completion
    const syncComplete = new CustomEvent('pwa-sync-complete', { detail: message });
    window.dispatchEvent(syncComplete);
  }

  // Public methods
  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  isRunningStandalone(): boolean {
    return this.isStandalone;
  }

  async checkForUpdates(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return true;
      }
      return false;
    } catch (error) {
      console.error('[PWA] Error checking for updates:', error);
      return false;
    }
  }

  async skipWaiting(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  // Offline detection
  isOnline(): boolean {
    return navigator.onLine;
  }

  onOnline(callback: () => void): () => void {
    window.addEventListener('online', callback);
    return () => window.removeEventListener('online', callback);
  }

  onOffline(callback: () => void): () => void {
    window.addEventListener('offline', callback);
    return () => window.removeEventListener('offline', callback);
  }

  // Cache management
  async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('[PWA] All caches cleared');
    }
  }

  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) {
      return 0;
    }

    let totalSize = 0;
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  }

  // Format cache size for display
  formatCacheSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Network status
  getConnectionType(): string {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      return connection.effectiveType || connection.type || 'unknown';
    }
    
    return 'unknown';
  }

  isSlowConnection(): boolean {
    const connection = (navigator as any).connection;
    if (connection) {
      return connection.effectiveType === 'slow-2g' || 
             connection.effectiveType === '2g' ||
             connection.saveData === true;
    }
    return false;
  }
}

// Create singleton instance
export const pwaManager = new PWAManager();

// React hook for PWA functionality
export function usePWA() {
  const [canInstall, setCanInstall] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    // Initial state
    setCanInstall(pwaManager.canInstall());
    setIsInstalled(pwaManager.isAppInstalled());
    setIsOnline(pwaManager.isOnline());

    // Event listeners
    const handleInstallAvailable = () => setCanInstall(true);
    const handleInstallCompleted = () => {
      setCanInstall(false);
      setIsInstalled(true);
    };
    const handleUpdateAvailable = () => setUpdateAvailable(true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-completed', handleInstallCompleted);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-completed', handleInstallCompleted);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    canInstall,
    isInstalled,
    isOnline,
    updateAvailable,
    install: () => pwaManager.showInstallPrompt(),
    checkForUpdates: () => pwaManager.checkForUpdates(),
    skipWaiting: () => pwaManager.skipWaiting(),
    clearCache: () => pwaManager.clearCache(),
    getCacheSize: () => pwaManager.getCacheSize(),
    formatCacheSize: (bytes: number) => pwaManager.formatCacheSize(bytes),
    getConnectionType: () => pwaManager.getConnectionType(),
    isSlowConnection: () => pwaManager.isSlowConnection()
  };
}

export default pwaManager;