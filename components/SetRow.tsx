import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useDeleteSet, useUpdateSet } from '@/hooks/useWorkouts';
import type { WorkoutSet } from '@/types/domain';

type Props = {
  set: WorkoutSet;
  workoutId: string;
};

export function SetRow({ set, workoutId }: Props) {
  const [reps, setReps] = useState(set.reps?.toString() ?? '');
  const [weight, setWeight] = useState(set.weight_kg?.toString() ?? '');
  const [editing, setEditing] = useState(set.reps === null);

  const updateSet = useUpdateSet();
  const deleteSet = useDeleteSet();

  useEffect(() => {
    setReps(set.reps?.toString() ?? '');
    setWeight(set.weight_kg?.toString() ?? '');
    setEditing(set.reps === null);
  }, [set.reps, set.weight_kg]);

  const save = () => {
    const repsNum = parseInt(reps, 10);
    const weightNum = parseFloat(weight.replace(',', '.'));
    if (Number.isNaN(repsNum) || Number.isNaN(weightNum)) return;
    updateSet.mutate(
      {
        setId: set.id,
        workoutId,
        reps: repsNum,
        weight_kg: weightNum,
      },
      { onSuccess: () => setEditing(false) },
    );
  };

  const remove = () => {
    deleteSet.mutate({ setId: set.id, workoutId });
  };

  if (!editing) {
    return (
      <Pressable style={styles.row} onPress={() => setEditing(true)}>
        <Text style={styles.index}>{set.set_index}</Text>
        <Text style={styles.value}>{set.weight_kg} kg</Text>
        <Text style={styles.times}>×</Text>
        <Text style={styles.value}>{set.reps} reps</Text>
        <View style={{ flex: 1 }} />
        <Pressable onPress={remove} hitSlop={8}>
          <Text style={styles.delete}>×</Text>
        </Pressable>
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      <Text style={styles.index}>{set.set_index}</Text>
      <TextInput
        style={styles.input}
        placeholder="kg"
        placeholderTextColor="#666"
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
      />
      <Text style={styles.times}>×</Text>
      <TextInput
        style={styles.input}
        placeholder="reps"
        placeholderTextColor="#666"
        keyboardType="number-pad"
        value={reps}
        onChangeText={setReps}
      />
      <Pressable
        style={[styles.saveButton, (!reps || !weight) && styles.saveButtonDisabled]}
        onPress={save}
        disabled={!reps || !weight || updateSet.isPending}
      >
        <Text style={styles.saveText}>Spara</Text>
      </Pressable>
      <Pressable onPress={remove} hitSlop={8}>
        <Text style={styles.delete}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  index: {
    color: '#666',
    fontSize: 13,
    width: 18,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0f0f0f',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 8,
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 70,
    textAlign: 'center',
  },
  value: { color: '#fff', fontSize: 15, fontWeight: '500', minWidth: 40 },
  times: { color: '#666' },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveButtonDisabled: { backgroundColor: '#1e3a8a', opacity: 0.5 },
  saveText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  delete: { color: '#666', fontSize: 22, paddingHorizontal: 4 },
});
