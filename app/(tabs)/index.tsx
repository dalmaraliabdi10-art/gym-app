import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BodyFigure } from '@/components/BodyFigure/BodyFigure';
import type { MuscleSlug } from '@/components/BodyFigure/muscles';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/lib/auth';

export default function BodyScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const { data: isAdmin } = useIsAdmin();

  const handlePressMuscle = (slug: MuscleSlug) => {
    router.push(`/muscle/${slug}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Body</Text>
        <View style={styles.headerActions}>
          {isAdmin && (
            <Pressable onPress={() => router.push('/admin/exercises')} hitSlop={12}>
              <Text style={styles.adminLink}>Admin</Text>
            </Pressable>
          )}
          <Pressable onPress={signOut} hitSlop={12}>
            <Text style={styles.signOut}>Sign out</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.hint}>Klicka på en muskel för att se övningar</Text>
      <View style={styles.figure}>
        <BodyFigure onPressMuscle={handlePressMuscle} />
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
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  adminLink: { color: '#a855f7', fontSize: 14, fontWeight: '600' },
  signOut: { color: '#60a5fa', fontSize: 14 },
  hint: { color: '#888', fontSize: 13, textAlign: 'center', paddingBottom: 8 },
  figure: { flex: 1, paddingHorizontal: 16, paddingBottom: 16 },
});
