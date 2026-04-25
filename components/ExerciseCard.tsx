import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MUSCLES } from '@/components/BodyFigure/muscles';
import type { Exercise } from '@/types/domain';

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Nybörjare',
  intermediate: 'Medel',
  advanced: 'Avancerad',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
};

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const router = useRouter();
  const primaryName =
    MUSCLES[exercise.primary_muscles[0] as keyof typeof MUSCLES]?.name_sv ?? exercise.primary_muscles[0];

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/exercise/${exercise.id}`)}
    >
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>
          {exercise.name}
        </Text>
        <View style={[styles.diffDot, { backgroundColor: DIFFICULTY_COLORS[exercise.difficulty] }]} />
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.muscle}>{primaryName}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.equipment}>{exercise.equipment}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.difficulty}>{DIFFICULTY_LABELS[exercise.difficulty]}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  cardPressed: { backgroundColor: '#222' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1 },
  diffDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, flexWrap: 'wrap' },
  muscle: { color: '#60a5fa', fontSize: 13, fontWeight: '500' },
  equipment: { color: '#888', fontSize: 13, textTransform: 'capitalize' },
  difficulty: { color: '#888', fontSize: 13 },
  dot: { color: '#555', marginHorizontal: 6 },
});
