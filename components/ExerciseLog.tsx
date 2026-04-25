import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAddSet } from '@/hooks/useWorkouts';
import type { Exercise, WorkoutSet } from '@/types/domain';
import { SetRow } from './SetRow';

type Props = {
  exercise: Exercise;
  sets: WorkoutSet[];
  workoutId: string;
};

export function ExerciseLog({ exercise, sets, workoutId }: Props) {
  const addSet = useAddSet();

  const handleAddSet = () => {
    addSet.mutate({ workoutId, exerciseId: exercise.id });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {exercise.name}
        </Text>
      </View>
      {sets.map((set) => (
        <SetRow key={set.id} set={set} workoutId={workoutId} />
      ))}
      <Pressable
        style={styles.addSet}
        onPress={handleAddSet}
        disabled={addSet.isPending}
      >
        <Text style={styles.addSetText}>+ Lägg till set</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1 },
  addSet: {
    marginTop: 6,
    paddingVertical: 8,
    alignItems: 'center',
    borderTopColor: '#2a2a2a',
    borderTopWidth: 1,
  },
  addSetText: { color: '#60a5fa', fontSize: 14, fontWeight: '500' },
});
