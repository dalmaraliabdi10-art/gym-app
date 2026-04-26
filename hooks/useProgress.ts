import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type LoggedSet = {
  id: string;
  workout_id: string;
  exercise_id: string;
  weight_kg: number;
  reps: number;
  completed_at: string;
  exercise: { id: string; name: string };
};

export function useAllLoggedSets() {
  return useQuery({
    queryKey: ['progress', 'all-sets'],
    queryFn: async (): Promise<LoggedSet[]> => {
      const { data, error } = await supabase
        .from('workout_sets')
        .select('id, workout_id, exercise_id, weight_kg, reps, completed_at, exercise:exercises(id, name)')
        .not('weight_kg', 'is', null)
        .not('reps', 'is', null)
        .order('completed_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as LoggedSet[];
    },
  });
}

export function useExerciseHistory(exerciseId: string | undefined) {
  return useQuery({
    queryKey: ['progress', 'exercise', exerciseId],
    enabled: !!exerciseId,
    queryFn: async (): Promise<LoggedSet[]> => {
      if (!exerciseId) return [];
      const { data, error } = await supabase
        .from('workout_sets')
        .select('id, workout_id, exercise_id, weight_kg, reps, completed_at, exercise:exercises(id, name)')
        .eq('exercise_id', exerciseId)
        .not('weight_kg', 'is', null)
        .not('reps', 'is', null)
        .order('completed_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as LoggedSet[];
    },
  });
}
