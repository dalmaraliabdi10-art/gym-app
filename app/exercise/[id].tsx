import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MUSCLES, type MuscleSlug } from '@/components/BodyFigure/muscles';
import { useExercise } from '@/hooks/useExercises';

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Nybörjare',
  intermediate: 'Medel',
  advanced: 'Avancerad',
};

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: exercise, isLoading, error } = useExercise(id);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color="#60a5fa" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Övningen kunde inte hittas.</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Tillbaka</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{exercise.name}</Text>

      <View style={styles.chipRow}>
        <Chip label={exercise.equipment} />
        <Chip label={DIFFICULTY_LABELS[exercise.difficulty] ?? exercise.difficulty} />
      </View>

      {exercise.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beskrivning</Text>
          <Text style={styles.description}>{exercise.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Muskler</Text>
        <Text style={styles.subTitle}>Primära</Text>
        <View style={styles.chipRow}>
          {exercise.primary_muscles.map((slug) => (
            <MuscleChip key={slug} slug={slug} primary />
          ))}
        </View>
        {exercise.secondary_muscles.length > 0 && (
          <>
            <Text style={[styles.subTitle, { marginTop: 12 }]}>Sekundära</Text>
            <View style={styles.chipRow}>
              {exercise.secondary_muscles.map((slug) => (
                <MuscleChip key={slug} slug={slug} />
              ))}
            </View>
          </>
        )}
      </View>

      {exercise.form_tips.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Form-tips</Text>
          {exercise.form_tips.map((tip, idx) => (
            <View key={idx} style={styles.tipRow}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      {exercise.video_url && (
        <Pressable
          style={styles.videoButton}
          onPress={() => Linking.openURL(exercise.video_url!)}
        >
          <Text style={styles.videoButtonText}>Se video</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function MuscleChip({ slug, primary }: { slug: string; primary?: boolean }) {
  const router = useRouter();
  const meta = MUSCLES[slug as MuscleSlug];
  const label = meta?.name_sv ?? slug;
  return (
    <Pressable
      style={[styles.chip, primary && styles.chipPrimary]}
      onPress={() => meta && router.push(`/muscle/${slug}`)}
    >
      <Text style={[styles.chipText, primary && styles.chipTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 20, paddingBottom: 40, gap: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: '700' },
  section: { gap: 8 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 4 },
  subTitle: { color: '#888', fontSize: 13 },
  description: { color: '#ccc', fontSize: 15, lineHeight: 22 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipPrimary: { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' },
  chipText: { color: '#aaa', fontSize: 13, textTransform: 'capitalize' },
  chipTextPrimary: { color: '#fff', fontWeight: '600' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tipBullet: { color: '#60a5fa', fontSize: 16, lineHeight: 22 },
  tipText: { color: '#ddd', fontSize: 15, lineHeight: 22, flex: 1 },
  videoButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  videoButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  errorText: { color: '#ef4444', fontSize: 14 },
  backButton: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  backButtonText: { color: '#fff', fontWeight: '600' },
});
