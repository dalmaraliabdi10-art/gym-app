import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LineChart, type Point } from '@/components/charts/LineChart';
import { useExerciseHistory, type LoggedSet } from '@/hooks/useProgress';

type DayStat = { date: string; maxWeight: number; volume: number };

export default function ExerciseProgressScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const { data: sets, isLoading } = useExerciseHistory(exerciseId);

  const stats = useMemo(() => computeDailyStats(sets ?? []), [sets]);
  const exerciseName = sets?.[0]?.exercise.name ?? '';
  const pr = stats.length > 0 ? Math.max(...stats.map((s) => s.maxWeight)) : 0;
  const totalSets = sets?.length ?? 0;

  const weightPoints: Point[] = stats.map((s, i) => ({ x: i, y: s.maxWeight, label: s.date }));
  const volumePoints: Point[] = stats.map((s, i) => ({ x: i, y: s.volume, label: s.date }));

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#60a5fa" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{exerciseName}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pr} kg</Text>
          <Text style={styles.statLabel}>Personligt rekord</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.length}</Text>
          <Text style={styles.statLabel}>Pass loggade</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalSets}</Text>
          <Text style={styles.statLabel}>Set totalt</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Max-vikt per pass</Text>
      <View style={styles.chartCard}>
        <LineChart data={weightPoints} height={200} yLabel="kg" />
      </View>

      <Text style={styles.sectionTitle}>Volym per pass</Text>
      <View style={styles.chartCard}>
        <LineChart data={volumePoints} height={200} yLabel="kg × reps" />
      </View>

      <Text style={styles.sectionTitle}>Senaste pass</Text>
      <View style={styles.recentCard}>
        {stats.slice(-10).reverse().map((s, i) => (
          <View key={i} style={[styles.recentRow, i > 0 && styles.recentRowBorder]}>
            <Text style={styles.recentDate}>{formatDate(s.date)}</Text>
            <Text style={styles.recentValue}>{s.maxWeight} kg</Text>
            <Text style={styles.recentVolume}>{Math.round(s.volume)} kg vol</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function computeDailyStats(sets: LoggedSet[]): DayStat[] {
  const byDay = new Map<string, { maxWeight: number; volume: number }>();
  for (const set of sets) {
    const day = set.completed_at.slice(0, 10); // YYYY-MM-DD
    const cur = byDay.get(day) ?? { maxWeight: 0, volume: 0 };
    cur.maxWeight = Math.max(cur.maxWeight, set.weight_kg);
    cur.volume += set.weight_kg * set.reps;
    byDay.set(day, cur);
  }
  return Array.from(byDay.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function formatDate(yyyymmdd: string) {
  const d = new Date(yyyymmdd);
  return d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  title: { color: '#fff', fontSize: 28, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  sectionTitle: { color: '#888', fontSize: 14, marginBottom: 4, marginTop: 8 },
  chartCard: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  recentCard: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  recentRowBorder: { borderTopColor: '#2a2a2a', borderTopWidth: 1 },
  recentDate: { color: '#aaa', fontSize: 13, width: 80 },
  recentValue: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
  recentVolume: { color: '#888', fontSize: 12 },
});
