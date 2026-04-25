import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth';

export default function BodyScreen() {
  const { session, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Body</Text>
        <Pressable onPress={signOut} hitSlop={12}>
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>Kroppsfigur kommer här</Text>
        <Text style={styles.placeholderText}>
          Inloggad som {session?.user.email}.{'\n'}
          Body figure med klickbara muskler byggs i milstolpe 2.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: { color: '#fff', fontSize: 28, fontWeight: '700' },
  signOut: { color: '#60a5fa', fontSize: 14 },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  placeholderTitle: { color: '#fff', fontSize: 20, marginBottom: 12 },
  placeholderText: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
