import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExerciseCard } from '@/components/ExerciseCard';
import { useExercises } from '@/hooks/useExercises';

export default function LibraryScreen() {
  const [search, setSearch] = useState('');
  const { data: exercises, isLoading, error } = useExercises({ search });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Library</Text>
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
          <Text style={styles.emptyText}>Inga övningar hittades</Text>
          <Text style={styles.emptyHint}>
            {search.length > 0 ? `"${search}" matchade inget` : 'Kör seed.sql i Supabase för att fylla biblioteket'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(e) => e.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ExerciseCard exercise={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginVertical: 12, paddingLeft: 4 },
  search: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    padding: 12,
    marginBottom: 12,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 6 },
  errorText: { color: '#ef4444', fontSize: 14 },
  errorHint: { color: '#888', fontSize: 13 },
  emptyText: { color: '#888', fontSize: 14 },
  emptyHint: { color: '#666', fontSize: 13, textAlign: 'center' },
  list: { paddingBottom: 20 },
});
