import { useIsMutating } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';

import { useOnlineStatus } from '@/lib/network';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const pendingMutations = useIsMutating();

  if (isOnline && pendingMutations === 0) return null;

  return (
    <View style={[styles.container, isOnline ? styles.syncing : styles.offline]}>
      <Text style={styles.text}>
        {!isOnline
          ? `Offline${pendingMutations > 0 ? ` · ${pendingMutations} väntar på sync` : ''}`
          : `Synkar ${pendingMutations} ändringar...`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  offline: { backgroundColor: '#7f1d1d' },
  syncing: { backgroundColor: '#1e3a8a' },
  text: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
