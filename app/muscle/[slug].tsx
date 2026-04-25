import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MUSCLES, type MuscleSlug } from '@/components/BodyFigure/muscles';

export default function MuscleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const muscle = MUSCLES[slug as MuscleSlug];

  if (!muscle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Muskeln {String(slug)} hittades inte.</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Tillbaka</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{muscle.name_sv}</Text>
        <Text style={styles.subtitle}>{muscle.name_en}</Text>
        <Text style={styles.region}>{muscle.region === 'front' ? 'Främre' : 'Bakre'} muskelgrupp</Text>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderTitle}>Övningsförslag kommer snart</Text>
          <Text style={styles.placeholderText}>
            Övningsbiblioteket byggs i milstolpe 3. Då visas övningar för{' '}
            {muscle.name_sv.toLowerCase()} med form-tips här.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 20, gap: 8 },
  title: { color: '#fff', fontSize: 32, fontWeight: '700' },
  subtitle: { color: '#888', fontSize: 16 },
  region: { color: '#60a5fa', fontSize: 13, marginTop: 4 },
  placeholderCard: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 8,
  },
  placeholderTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  placeholderText: { color: '#aaa', fontSize: 14, lineHeight: 20 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 },
  notFoundText: { color: '#888', fontSize: 14 },
  backButton: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  backButtonText: { color: '#fff', fontWeight: '600' },
});
