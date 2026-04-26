import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAllLoggedSets, type LoggedSet } from '@/hooks/useProgress';
import { usePastWorkouts } from '@/hooks/useWorkouts';

type ExerciseSummary = {
  exerciseId: string;
  name: string;
  pr: number;
  lastWeight: number;
  lastDate: string;
  setCount: number;
};

export default function ProgressScreen() {
  const { data: sets, isLoading } = useAllLoggedSets();
  const { data: pastWorkouts } = usePastWorkouts();
  const router = useRouter();

  const stats = useMemo(() => computeStats(sets ?? [], pastWorkouts?.length ?? 0), [sets, pastWorkouts]);
  const exerciseList = useMemo(() => computeExerciseList(sets ?? []), [sets]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Progress</Text>

      <View style={styles.statsRow}>
        <StatCard label="Pass denna vecka" value={String(stats.thisWeekWorkouts)} />
        <StatCard label="Total volym" value={`${formatVolume(stats.totalVolume)}`} suffix="kg" />
        <StatCard label="Övningar" value={String(stats.distinctExercises)} />
      </View>

      <Text style={styles.sectionTitle}>Övningar</Text>
      {isLoading ? (
        <ActivityIndicator color="#60a5fa" style={{ marginTop: 24 }} />
      ) : exerciseList.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Inga loggade set än.</Text>
          <Text style={styles.emptyHint}>Starta ett pass och logga några set så syns de här.</Text>
        </View>
      ) : (
        <FlatList
          data={exerciseList}
          keyExtractor={(item) => item.exerciseId}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => router.push(`/progress/${item.exerciseId}`)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowMeta}>
                  PR {item.pr} kg · senast {item.lastWeight} kg · {item.setCount} set
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value}
        {suffix && <Text style={styles.statSuffix}> {suffix}</Text>}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function startOfWeek(d: Date) {
  const day = d.getDay() || 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function computeStats(sets: LoggedSet[], totalCompletedWorkouts: number) {
  const totalVolume = sets.reduce((sum, s) => sum + s.weight_kg * s.reps, 0);
  const distinctExercises = new Set(sets.map((s) => s.exercise_id)).size;

  const weekStart = startOfWeek(new Date());
  const thisWeekWorkoutIds = new Set(
    sets.filter((s) => new Date(s.completed_at) >= weekStart).map((s) => s.workout_id),
  );

  return {
    totalVolume,
    distinctExercises,
    totalWorkouts: totalCompletedWorkouts,
    thisWeekWorkouts: thisWeekWorkoutIds.size,
  };
}

function computeExerciseList(sets: LoggedSet[]): ExerciseSummary[] {
  const map = new Map<string, ExerciseSummary>();
  for (const set of sets) {
    const cur = map.get(set.exercise_id);
    if (!cur) {
      map.set(set.exercise_id, {
        exerciseId: set.exercise_id,
        name: set.exercise.name,
        pr: set.weight_kg,
        lastWeight: set.weight_kg,
        lastDate: set.completed_at,
        setCount: 1,
      });
    } else {
      cur.setCount += 1;
      if (set.weight_kg > cur.pr) cur.pr = set.weight_kg;
      if (new Date(set.completed_at) > new Date(cur.lastDate)) {
        cur.lastDate = set.completed_at;
        cur.lastWeight = set.weight_kg;
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => +new Date(b.lastDate) - +new Date(a.lastDate));
}

function formatVolume(kg: number) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  return Math.round(kg).toString();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginVertical: 12, paddingLeft: 4 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '700' },
  statSuffix: { color: '#888', fontSize: 14, fontWeight: '500' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  sectionTitle: { color: '#888', fontSize: 14, marginBottom: 8, paddingLeft: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
  },
  rowPressed: { backgroundColor: '#222' },
  rowName: { color: '#fff', fontSize: 16, fontWeight: '500' },
  rowMeta: { color: '#888', fontSize: 13, marginTop: 2 },
  chevron: { color: '#666', fontSize: 24 },
  empty: { alignItems: 'center', padding: 24, gap: 6 },
  emptyText: { color: '#888', fontSize: 14 },
  emptyHint: { color: '#666', fontSize: 13, textAlign: 'center' },
});
