import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Workout, WorkoutSet, WorkoutSetWithExercise } from '@/types/domain';

const ACTIVE_KEY = ['workouts', 'active'];
const PAST_KEY = ['workouts', 'past'];
const setsKey = (workoutId: string) => ['workouts', workoutId, 'sets'];

export function useActiveWorkout() {
  return useQuery({
    queryKey: ACTIVE_KEY,
    queryFn: async (): Promise<Workout | null> => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Workout | null;
    },
  });
}

export function usePastWorkouts() {
  return useQuery({
    queryKey: PAST_KEY,
    queryFn: async (): Promise<Workout[]> => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .not('ended_at', 'is', null)
        .order('started_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as Workout[];
    },
  });
}

export function useWorkoutSets(workoutId: string | undefined) {
  return useQuery({
    queryKey: workoutId ? setsKey(workoutId) : ['workouts', 'sets', 'none'],
    enabled: !!workoutId,
    queryFn: async (): Promise<WorkoutSetWithExercise[]> => {
      if (!workoutId) return [];
      const { data, error } = await supabase
        .from('workout_sets')
        .select('*, exercise:exercises(*)')
        .eq('workout_id', workoutId)
        .order('set_index', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as WorkoutSetWithExercise[];
    },
  });
}

export function useStartWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<Workout> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Inte inloggad');
      const { data, error } = await supabase
        .from('workouts')
        .insert({ user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as Workout;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACTIVE_KEY });
    },
  });
}

export function useEndWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (workoutId: string) => {
      // Clean up empty placeholder sets first.
      await supabase
        .from('workout_sets')
        .delete()
        .eq('workout_id', workoutId)
        .is('reps', null)
        .is('weight_kg', null);

      const { error } = await supabase
        .from('workouts')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', workoutId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACTIVE_KEY });
      qc.invalidateQueries({ queryKey: PAST_KEY });
    },
  });
}

export function useAddSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      workoutId: string;
      exerciseId: string;
    }): Promise<WorkoutSet> => {
      // Find next set_index for this exercise within this workout.
      const { data: existing, error: countErr } = await supabase
        .from('workout_sets')
        .select('set_index')
        .eq('workout_id', params.workoutId)
        .eq('exercise_id', params.exerciseId)
        .order('set_index', { ascending: false })
        .limit(1);
      if (countErr) throw countErr;
      const nextIndex = (existing?.[0]?.set_index ?? 0) + 1;

      const { data, error } = await supabase
        .from('workout_sets')
        .insert({
          workout_id: params.workoutId,
          exercise_id: params.exerciseId,
          set_index: nextIndex,
        })
        .select()
        .single();
      if (error) throw error;
      return data as WorkoutSet;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: setsKey(vars.workoutId) });
    },
  });
}

export function useUpdateSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      setId: string;
      workoutId: string;
      reps: number | null;
      weight_kg: number | null;
    }) => {
      const { error } = await supabase
        .from('workout_sets')
        .update({ reps: params.reps, weight_kg: params.weight_kg })
        .eq('id', params.setId);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: setsKey(vars.workoutId) });
    },
  });
}

export function useDeleteSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { setId: string; workoutId: string }) => {
      const { error } = await supabase.from('workout_sets').delete().eq('id', params.setId);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: setsKey(vars.workoutId) });
    },
  });
}
