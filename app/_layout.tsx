import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import 'react-native-reanimated';

import { OfflineBanner } from '@/components/OfflineBanner';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/lib/auth';
import { setupOnlineManager } from '@/lib/network';
import { queryClient, queryPersister } from '@/lib/queryClient';
import { TimerProvider } from '@/lib/timer';

setupOnlineManager();

function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/login');
    } else if (session && inAuthGroup) {
      router.replace('/');
    }
  }, [session, segments, loading, router]);

  if (loading) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        dehydrateOptions: {
          shouldDehydrateMutation: (m) => m.state.status !== 'success',
        },
      }}
    >
      <AuthProvider>
        <TimerProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <OfflineBanner />
          <AuthGate>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#0a0a0a' },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen
                name="muscle/[slug]"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: '#0a0a0a' },
                  headerTintColor: '#fff',
                  headerTitle: '',
                  headerBackTitle: 'Body',
                }}
              />
              <Stack.Screen
                name="exercise/[id]"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: '#0a0a0a' },
                  headerTintColor: '#fff',
                  headerTitle: '',
                  headerBackTitle: 'Tillbaka',
                }}
              />
              <Stack.Screen
                name="workout/add-exercise"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  contentStyle: { backgroundColor: '#0a0a0a' },
                }}
              />
              <Stack.Screen
                name="progress/[exerciseId]"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: '#0a0a0a' },
                  headerTintColor: '#fff',
                  headerTitle: '',
                  headerBackTitle: 'Progress',
                }}
              />
              <Stack.Screen
                name="admin/exercises"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: '#0a0a0a' },
                  headerTintColor: '#fff',
                  headerTitle: '',
                  headerBackTitle: 'Body',
                }}
              />
              <Stack.Screen
                name="admin/exercise/new"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: '#0a0a0a' },
                  headerTintColor: '#fff',
                  headerTitle: 'Ny övning',
                }}
              />
              <Stack.Screen
                name="admin/exercise/[id]"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: '#0a0a0a' },
                  headerTintColor: '#fff',
                  headerTitle: 'Redigera övning',
                }}
              />
            </Stack>
          </AuthGate>
          <StatusBar style="light" />
        </ThemeProvider>
        </TimerProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}
