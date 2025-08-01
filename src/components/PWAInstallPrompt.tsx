'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { pwaManager } from '@/lib/pwa';

interface PWAInstallPromptProps {
  className?: string;
}

export default function PWAInstallPrompt({ className = '' }: PWAInstallPromptProps) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);
  const [cacheSize, setCacheSize] = useState('0 B');
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    // Initial state
    setIsOnline(navigator.onLine);
    setConnectionType(pwaManager.getConnectionType());
    updateCacheSize();

    // Event listeners
    const handleInstallAvailable = () => {
      console.log('PWA install available');
      setShowInstallPrompt(true);
    };

    const handleInstallCompleted = () => {
      console.log('PWA install completed');
      setShowInstallPrompt(false);
      setIsInstalling(false);
    };

    const handleUpdateAvailable = () => {
      console.log('PWA update available');
      setShowUpdatePrompt(true);
    };

    const handleOnline = () => {
      setIsOnline(true);
      setConnectionType(pwaManager.getConnectionType());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleSyncComplete = (event: CustomEvent) => {
      console.log('Background sync completed:', event.detail);
    };

    // Add event listeners
    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-completed', handleInstallCompleted);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('pwa-sync-complete', handleSyncComplete as EventListener);

    // Check initial install availability
    if (pwaManager.canInstall()) {
      setShowInstallPrompt(true);
    }

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-completed', handleInstallCompleted);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('pwa-sync-complete', handleSyncComplete as EventListener);
    };
  }, []);

  const updateCacheSize = async () => {
    try {
      const size = await pwaManager.getCacheSize();
      setCacheSize(pwaManager.formatCacheSize(size));
    } catch (error) {
      console.error('Error getting cache size:', error);
    }
  };

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const installed = await pwaManager.showInstallPrompt();
      if (installed) {
        setShowInstallPrompt(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await pwaManager.skipWaiting();
      setShowUpdatePrompt(false);
      window.location.reload();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      await pwaManager.clearCache();
      await updateCacheSize();
      window.location.reload();
    } catch (error) {
      console.error('Clear cache failed:', error);
    }
  };

  return (
    <div className={className}>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900">Install RemoteInbound</h3>
              <p className="text-xs text-gray-600 mt-1">
                Get the app for offline access and a better experience
              </p>
              
              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {isInstalling ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  <span>{isInstalling ? 'Installing...' : 'Install'}</span>
                </button>
                
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900">Update Available</h3>
              <p className="text-xs text-gray-600 mt-1">
                A new version of RemoteInbound is ready to install
              </p>
              
              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={handleUpdate}
                  className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700"
                >
                  <CheckCircle className="w-3 h-3" />
                  <span>Update Now</span>
                </button>
                
                <button
                  onClick={() => setShowUpdatePrompt(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="fixed top-4 left-4 z-40">
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          isOnline 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isOnline ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
          {isOnline && connectionType !== 'unknown' && (
            <span className="text-xs opacity-75">({connectionType})</span>
          )}
        </div>
      </div>

      {/* PWA Status Panel (for development/debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-3 rounded-lg text-xs max-w-xs z-40">
          <div className="font-semibold mb-2">PWA Status</div>
          <div className="space-y-1">
            <div>Installed: {pwaManager.isAppInstalled() ? 'Yes' : 'No'}</div>
            <div>Standalone: {pwaManager.isRunningStandalone() ? 'Yes' : 'No'}</div>
            <div>Can Install: {pwaManager.canInstall() ? 'Yes' : 'No'}</div>
            <div>Cache Size: {cacheSize}</div>
            <div>Connection: {connectionType}</div>
            <div>Slow Connection: {pwaManager.isSlowConnection() ? 'Yes' : 'No'}</div>
          </div>
          
          <button
            onClick={handleClearCache}
            className="mt-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
          >
            Clear Cache
          </button>
        </div>
      )}
    </div>
  );
}

// Hook for PWA functionality
export function usePWAStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Initial state
    setIsOnline(navigator.onLine);
    setCanInstall(pwaManager.canInstall());
    setIsInstalled(pwaManager.isAppInstalled());

    // Event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleInstallAvailable = () => setCanInstall(true);
    const handleInstallCompleted = () => {
      setCanInstall(false);
      setIsInstalled(true);
    };
    const handleUpdateAvailable = () => setUpdateAvailable(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-completed', handleInstallCompleted);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-completed', handleInstallCompleted);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  return {
    isOnline,
    canInstall,
    isInstalled,
    updateAvailable,
    install: () => pwaManager.showInstallPrompt(),
    checkForUpdates: () => pwaManager.checkForUpdates(),
    clearCache: () => pwaManager.clearCache(),
    getCacheSize: () => pwaManager.getCacheSize(),
    formatCacheSize: (bytes: number) => pwaManager.formatCacheSize(bytes)
  };
}