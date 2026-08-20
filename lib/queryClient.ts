import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Offline-aware QueryClient: queries and mutations both pause when there's
// no network and resume automatically when it comes back. Mutations are
// kept in cache so they survive an app reload while offline.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: ONE_WEEK_MS,
      retry: 1,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 3,
      networkMode: 'offlineFirst',
      gcTime: ONE_WEEK_MS,
    },
  },
});

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'gym-app-rq-cache',
  throttleTime: 1000,
});
