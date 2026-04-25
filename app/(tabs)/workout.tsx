import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExerciseLog } from '@/components/ExerciseLog';
import {
  useActiveWorkout,
  useEndWorkout,
  usePastWorkouts,
  useStartWorkout,
  useWorkoutSets,
} from '@/hooks/useWorkouts';
import type { Exercise, WorkoutSetWithExercise } from '@/types/domain';

export default function WorkoutScreen() {
  const { data: active, isLoading } = useActiveWorkout();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color="#60a5fa" />
        </View>
      </SafeAreaView>
    );
  }

  return active ? <ActiveWorkoutView workoutId={active.id} startedAt={active.started_at} /> : <NoActiveView />;
}

function NoActiveView() {
  const startWorkout = useStartWorkout();
  const { data: past, isLoading: pastLoading } = usePastWorkouts();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Workout</Text>
      <Pressable
        style={[styles.startButton, startWorkout.isPending && styles.disabled]}
        onPress={() => startWorkout.mutate()}
        disabled={startWorkout.isPending}
      >
        <Text style={styles.startButtonText}>
          {startWorkout.isPending ? 'Startar...' : 'Starta nytt pass'}
        </Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Tidigare pass</Text>
      {pastLoading ? (
        <ActivityIndicator color="#60a5fa" style={{ marginTop: 12 }} />
      ) : !past || past.length === 0 ? (
        <Text style={styles.emptyText}>Inga avslutade pass än.</Text>
      ) : (
        <FlatList
          data={past}
          keyExtractor={(w) => w.id}
          renderItem={({ item }) => <PastWorkoutRow id={item.id} startedAt={item.started_at} endedAt={item.ended_at!} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

function PastWorkoutRow({ id, startedAt, endedAt }: { id: string; startedAt: string; endedAt: string }) {
  const { data: sets } = useWorkoutSets(id);
  const date = new Date(startedAt);
  const dur = Math.round((new Date(endedAt).getTime() - date.getTime()) / 60000);
  const dateStr = date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
  const timeStr = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  const exerciseCount = sets ? new Set(sets.map((s) => s.exercise_id)).size : 0;

  return (
    <View style={styles.pastRow}>
      <View>
        <Text style={styles.pastDate}>{dateStr} · {timeStr}</Text>
        <Text style={styles.pastMeta}>
          {exerciseCount} övningar · {sets?.length ?? 0} set · {dur} min
        </Text>
      </View>
    </View>
  );
}

function ActiveWorkoutView({ workoutId, startedAt }: { workoutId: string; startedAt: string }) {
  const router = useRouter();
  const { data: sets, isLoading } = useWorkoutSets(workoutId);
  const endWorkout = useEndWorkout();
  const [confirming, setConfirming] = useState(false);

  // Auto-reset the confirm state after 3s if user doesn't tap again.
  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(t);
  }, [confirming]);

  const grouped = useMemo(() => {
    const map = new Map<string, { exercise: Exercise; sets: WorkoutSetWithExercise[] }>();
    for (const set of sets ?? []) {
      const existing = map.get(set.exercise_id);
      if (existing) existing.sets.push(set);
      else map.set(set.exercise_id, { exercise: set.exercise, sets: [set] });
    }
    return Array.from(map.values());
  }, [sets]);

  const startedDate = new Date(startedAt);
  const startedStr = startedDate.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

  const handleEnd = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    endWorkout.mutate(workoutId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.activeHeader}>
        <View>
          <Text style={styles.title}>Aktivt pass</Text>
          <Text style={styles.subtitle}>Startat {startedStr}</Text>
        </View>
        <Pressable
          style={[
            styles.endButton,
            confirming && styles.endButtonConfirm,
            endWorkout.isPending && styles.disabled,
          ]}
          onPress={handleEnd}
          disabled={endWorkout.isPending}
        >
          <Text style={[styles.endButtonText, confirming && styles.endButtonTextConfirm]}>
            {endWorkout.isPending ? 'Avslutar...' : confirming ? 'Tryck igen' : 'Avsluta'}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {isLoading ? (
          <ActivityIndicator color="#60a5fa" />
        ) : grouped.length === 0 ? (
          <Text style={styles.emptyText}>Inga övningar än. Lägg till en nedan.</Text>
        ) : (
          grouped.map(({ exercise, sets: exSets }) => (
            <ExerciseLog
              key={exercise.id}
              exercise={exercise}
              sets={exSets}
              workoutId={workoutId}
            />
          ))
        )}
        <Pressable
          style={styles.addExerciseButton}
          onPress={() => router.push('/workout/add-exercise')}
        >
          <Text style={styles.addExerciseText}>+ Lägg till övning</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginVertical: 12, paddingLeft: 4 },
  subtitle: { color: '#888', fontSize: 14, paddingLeft: 4 },
  activeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  startButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  endButton: {
    backgroundColor: '#1a1a1a',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  endButtonConfirm: { backgroundColor: '#ef4444' },
  endButtonText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
  endButtonTextConfirm: { color: '#fff' },
  disabled: { opacity: 0.5 },
  sectionTitle: { color: '#888', fontSize: 14, marginTop: 16, marginBottom: 8, paddingLeft: 4 },
  emptyText: { color: '#666', fontSize: 14, paddingLeft: 4 },
  pastRow: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  pastDate: { color: '#fff', fontSize: 15, fontWeight: '600' },
  pastMeta: { color: '#888', fontSize: 13, marginTop: 2 },
  addExerciseButton: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2563eb',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addExerciseText: { color: '#60a5fa', fontSize: 15, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
