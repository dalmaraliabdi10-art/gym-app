import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MUSCLES, type MuscleSlug } from '@/components/BodyFigure/muscles';
import { ExerciseCard } from '@/components/ExerciseCard';
import { useExercises } from '@/hooks/useExercises';

export default function MuscleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const muscle = MUSCLES[slug as MuscleSlug];

  const { data: exercises, isLoading, error } = useExercises({ muscleSlug: slug });

  if (!muscle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.notFoundText}>Muskeln {String(slug)} hittades inte.</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Tillbaka</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{muscle.name_sv}</Text>
        <Text style={styles.subtitle}>
          {muscle.name_en} · {muscle.region === 'front' ? 'Främre' : 'Bakre'} muskelgrupp
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#60a5fa" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Kunde inte ladda övningar.</Text>
          <Text style={styles.errorHint}>Har du kört seed.sql i Supabase?</Text>
        </View>
      ) : !exercises || exercises.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Inga övningar för {muscle.name_sv.toLowerCase()} ännu</Text>
          <Text style={styles.emptyHint}>Kör supabase/seed.sql för att fylla övningsbiblioteket</Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(e) => e.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ExerciseCard exercise={item} />}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>{exercises.length} övningar</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { color: '#fff', fontSize: 32, fontWeight: '700' },
  subtitle: { color: '#888', fontSize: 14, marginTop: 4 },
  sectionTitle: { color: '#888', fontSize: 13, marginBottom: 8, marginLeft: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 8 },
  errorText: { color: '#ef4444', fontSize: 14 },
  errorHint: { color: '#888', fontSize: 13, textAlign: 'center' },
  emptyText: { color: '#888', fontSize: 14 },
  emptyHint: { color: '#666', fontSize: 13, textAlign: 'center' },
  notFoundText: { color: '#888', fontSize: 14 },
  backButton: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  backButtonText: { color: '#fff', fontWeight: '600' },
});
