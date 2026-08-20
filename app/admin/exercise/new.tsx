import { useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';

import { ExerciseForm } from '@/components/admin/ExerciseForm';
import { useCreateExercise } from '@/hooks/useAdmin';

export default function NewExerciseScreen() {
  const router = useRouter();
  const createExercise = useCreateExercise();

  return (
    <ExerciseForm
      submitLabel="Skapa övning"
      submitting={createExercise.isPending}
      onSubmit={(input) => {
        createExercise.mutate(input, {
          onSuccess: () => router.back(),
          onError: (err) => {
            const msg = err instanceof Error ? err.message : String(err);
            if (Platform.OS === 'web') window.alert('Fel: ' + msg);
            else Alert.alert('Fel', msg);
          },
        });
      }}
    />
  );
}
