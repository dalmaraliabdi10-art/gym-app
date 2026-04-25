import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useExercises } from '@/hooks/useExercises';
import { useActiveWorkout, useAddSet } from '@/hooks/useWorkouts';
import type { Exercise } from '@/types/domain';

export default function AddExerciseScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data: exercises, isLoading } = useExercises({ search });
  const { data: active } = useActiveWorkout();
  const addSet = useAddSet();

  const handlePick = (exercise: Exercise) => {
    if (!active) {
      Alert.alert('Inget aktivt pass', 'Starta ett pass först.');
      return;
    }
    addSet.mutate(
      { workoutId: active.id, exerciseId: exercise.id },
      {
        onSuccess: () => router.back(),
        onError: (err) => Alert.alert('Fel', err.message),
      },
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.cancel}>Avbryt</Text>
        </Pressable>
        <Text style={styles.title}>Lägg till övning</Text>
        <View style={{ width: 60 }} />
      </View>
      <TextInput
        style={styles.search}
        placeholder="Sök övning..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isLoading ? (
        <ActivityIndicator color="#60a5fa" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={exercises ?? []}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => handlePick(item)}
              disabled={addSet.isPending}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.equipment}</Text>
              </View>
              <Text style={styles.plus}>+</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>{search ? 'Inga matchande övningar' : 'Tomt bibliotek'}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  cancel: { color: '#60a5fa', fontSize: 15, width: 60 },
  title: { color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center', flex: 1 },
  search: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    padding: 12,
    marginVertical: 8,
  },
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
  name: { color: '#fff', fontSize: 16, fontWeight: '500' },
  meta: { color: '#888', fontSize: 13, textTransform: 'capitalize', marginTop: 2 },
  plus: { color: '#60a5fa', fontSize: 28, fontWeight: '300' },
  empty: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 24 },
});
