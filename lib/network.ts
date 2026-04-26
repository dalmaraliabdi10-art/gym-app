import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Bridge expo-network state into React Query's onlineManager so queries
// and mutations pause when offline and replay when back online.
// Guarded against SSR (typeof window) and called once at app start.
export function setupOnlineManager() {
  if (Platform.OS === 'web') {
    onlineManager.setEventListener((setOnline) => {
      if (typeof window === 'undefined') {
        return () => {};
      }
      const update = () => setOnline(window.navigator.onLine);
      window.addEventListener('online', update);
      window.addEventListener('offline', update);
      update();
      return () => {
        window.removeEventListener('online', update);
        window.removeEventListener('offline', update);
      };
    });
    return;
  }

  onlineManager.setEventListener((setOnline) => {
    const sub = Network.addNetworkStateListener((state) => {
      setOnline(!!state.isConnected && state.isInternetReachable !== false);
    });
    return () => sub.remove();
  });
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      const update = () => setIsOnline(window.navigator.onLine);
      update();
      window.addEventListener('online', update);
      window.addEventListener('offline', update);
      return () => {
        window.removeEventListener('online', update);
        window.removeEventListener('offline', update);
      };
    }
    let active = true;
    Network.getNetworkStateAsync().then((state) => {
      if (active) setIsOnline(!!state.isConnected && state.isInternetReachable !== false);
    });
    const sub = Network.addNetworkStateListener((state) => {
      setIsOnline(!!state.isConnected && state.isInternetReachable !== false);
    });
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  return isOnline;
}
