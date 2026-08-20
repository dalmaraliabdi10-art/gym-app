import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDeleteExercise, useIsAdmin } from '@/hooks/useAdmin';
import { useExercises } from '@/hooks/useExercises';
import type { Exercise } from '@/types/domain';

export default function AdminExercisesScreen() {
  const router = useRouter();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [search, setSearch] = useState('');
  const { data: exercises, isLoading } = useExercises({ search });
  const deleteExercise = useDeleteExercise();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmId) return;
    const t = setTimeout(() => setConfirmId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmId]);

  if (isAdminLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color="#60a5fa" />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.deniedTitle}>Endast admin</Text>
          <Text style={styles.deniedText}>
            Ditt konto är inte admin. Sätt is_admin = true på din profil i Supabase.
          </Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>Tillbaka</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    deleteExercise.mutate(id, { onSuccess: () => setConfirmId(null) });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin · Övningar</Text>
        <Pressable
          style={styles.newButton}
          onPress={() => router.push('/admin/exercise/new')}
        >
          <Text style={styles.newButtonText}>+ Ny</Text>
        </Pressable>
      </View>
      <TextInput
        style={styles.search}
        placeholder="Sök övning..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />
      {isLoading ? (
        <ActivityIndicator color="#60a5fa" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={exercises ?? []}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Row
              exercise={item}
              isConfirming={confirmId === item.id}
              onEdit={() => router.push(`/admin/exercise/${item.id}`)}
              onDelete={() => handleDelete(item.id)}
              busy={deleteExercise.isPending}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>Inga övningar.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

function Row({
  exercise,
  isConfirming,
  onEdit,
  onDelete,
  busy,
}: {
  exercise: Exercise;
  isConfirming: boolean;
  onEdit: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  return (
    <View style={styles.row}>
      <Pressable style={{ flex: 1 }} onPress={onEdit}>
        <Text style={styles.rowName}>{exercise.name}</Text>
        <Text style={styles.rowMeta}>
          {exercise.equipment} · {exercise.difficulty} · {exercise.primary_muscles.join(', ')}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.deleteButton, isConfirming && styles.deleteButtonConfirm]}
        onPress={onDelete}
        disabled={busy}
        hitSlop={6}
      >
        <Text style={[styles.deleteText, isConfirming && styles.deleteTextConfirm]}>
          {isConfirming ? 'Tryck igen' : 'Radera'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  newButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  newButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    gap: 8,
  },
  rowName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  rowMeta: { color: '#888', fontSize: 12, marginTop: 2 },
  deleteButton: {
    backgroundColor: '#1a1a1a',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 90,
    alignItems: 'center',
  },
  deleteButtonConfirm: { backgroundColor: '#ef4444' },
  deleteText: { color: '#ef4444', fontSize: 12, fontWeight: '600' },
  deleteTextConfirm: { color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  deniedTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  deniedText: { color: '#888', fontSize: 14, textAlign: 'center' },
  backButton: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  backText: { color: '#fff', fontWeight: '600' },
  empty: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 24 },
});
