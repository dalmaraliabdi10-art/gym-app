import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Platform, View } from 'react-native';

import { ExerciseForm } from '@/components/admin/ExerciseForm';
import { useUpdateExercise } from '@/hooks/useAdmin';
import { useExercise } from '@/hooks/useExercises';

export default function EditExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: exercise, isLoading } = useExercise(id);
  const updateExercise = useUpdateExercise();

  if (isLoading || !exercise) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#60a5fa" />
      </View>
    );
  }

  return (
    <ExerciseForm
      initial={exercise}
      submitLabel="Spara ändringar"
      submitting={updateExercise.isPending}
      onSubmit={(input) => {
        updateExercise.mutate(
          { id: exercise.id, input },
          {
            onSuccess: () => router.back(),
            onError: (err) => {
              const msg = err instanceof Error ? err.message : String(err);
              if (Platform.OS === 'web') window.alert('Fel: ' + msg);
              else Alert.alert('Fel', msg);
            },
          },
        );
      }}
    />
  );
}
