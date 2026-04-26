import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTimer } from '@/lib/timer';

const PRESETS_SECONDS = [60, 90, 120, 180, 300];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function presetLabel(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds % 60 === 0) return `${seconds / 60}m`;
  return `${Math.floor(seconds / 60)}m${seconds % 60}s`;
}

export function RestTimer() {
  const { remaining, duration, running, justFinished, start, stop } = useTimer();

  if (running) {
    const progress = duration > 0 ? remaining / duration : 0;
    return (
      <View style={styles.container}>
        <View style={styles.runningRow}>
          <View>
            <Text style={styles.label}>Vila kvar</Text>
            <Text style={styles.time}>{formatTime(remaining)}</Text>
          </View>
          <Pressable style={styles.stopButton} onPress={stop} hitSlop={8}>
            <Text style={styles.stopButtonText}>Stoppa</Text>
          </Pressable>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    );
  }

  if (justFinished) {
    return (
      <View style={[styles.container, styles.finishedContainer]}>
        <Text style={styles.finishedText}>Vilan är klar!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Vilotimer</Text>
      <View style={styles.presets}>
        {PRESETS_SECONDS.map((s) => (
          <Pressable key={s} style={styles.presetButton} onPress={() => start(s)}>
            <Text style={styles.presetText}>{presetLabel(s)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  finishedContainer: {
    backgroundColor: '#14532d',
    borderColor: '#22c55e',
    alignItems: 'center',
    paddingVertical: 16,
  },
  finishedText: { color: '#bbf7d0', fontSize: 17, fontWeight: '700' },
  label: { color: '#888', fontSize: 12, fontWeight: '500', marginBottom: 6, textTransform: 'uppercase' },
  presets: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  presetButton: {
    flex: 1,
    minWidth: 50,
    backgroundColor: '#0f0f0f',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  presetText: { color: '#60a5fa', fontSize: 14, fontWeight: '600' },
  runningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 2, fontVariant: ['tabular-nums'] },
  stopButton: {
    backgroundColor: '#1f1f1f',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  stopButtonText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
  progressTrack: {
    backgroundColor: '#2a2a2a',
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: { backgroundColor: '#3b82f6', height: '100%' },
});
