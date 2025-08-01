'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  Calendar, 
  Users, 
  Settings,
  Home
} from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-redirect when back online
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      // Test connection with a simple fetch
      const response = await fetch('/', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        window.location.href = '/';
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      console.log('Still offline');
    } finally {
      setTimeout(() => setIsRetrying(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Remote Inbound</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm font-medium">Online</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm font-medium">Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              {isOnline ? (
                <Wifi className="w-12 h-12 text-white" />
              ) : (
                <WifiOff className="w-12 h-12 text-white" />
              )}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isOnline ? "You're Back Online!" : "You're Offline"}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {isOnline 
              ? "Great! Your connection has been restored. You'll be redirected shortly."
              : "Don't worry! Remote Inbound works offline too. You can still access many features without an internet connection."
            }
          </p>

          {!isOnline && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Checking...' : 'Try Again'}</span>
            </button>
          )}
        </div>

        {/* Offline Features */}
        {!isOnline && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Offline</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Browse Cached Events</h3>
                    <p className="text-gray-600 text-sm">View previously loaded event information and details</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Access Your Dashboard</h3>
                    <p className="text-gray-600 text-sm">Check your registered events and profile information</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Local Registration</h3>
                    <p className="text-gray-600 text-sm">Register for events (data syncs when you're back online)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Speaker Profiles</h3>
                    <p className="text-gray-600 text-sm">Browse cached speaker information and bios</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Navigation</h2>
              
              <div className="space-y-3">
                <Link 
                  href="/"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Home className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Home</span>
                </Link>
                
                <Link 
                  href="/events"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Events</span>
                </Link>
                
                <Link 
                  href="/speakers"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Speakers</span>
                </Link>
                
                <Link 
                  href="/dashboard"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Connection Status</h2>
          
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-lg font-medium text-gray-900">
              {isOnline ? 'Connected to Internet' : 'No Internet Connection'}
            </span>
          </div>
          
          {!isOnline && (
            <p className="text-gray-600 mt-2">
              We'll automatically reconnect you when your internet connection is restored.
            </p>
          )}
        </div>

        {/* PWA Installation Prompt */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Install Remote Inbound</h2>
          <p className="text-blue-100 mb-6">
            Install our app for the best offline experience and quick access from your home screen.
          </p>
          <button
            onClick={() => {
              // This will be handled by the PWA install prompt
              if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'SHOW_INSTALL_PROMPT' });
              }
            }}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}