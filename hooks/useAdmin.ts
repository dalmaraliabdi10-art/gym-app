import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Difficulty, Exercise } from '@/types/domain';

export function useIsAdmin() {
  return useQuery({
    queryKey: ['admin', 'is-admin'],
    queryFn: async (): Promise<boolean> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();
      if (error) return false;
      return data?.is_admin === true;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export type ExerciseInput = {
  name: string;
  description: string | null;
  form_tips: string[];
  equipment: string;
  difficulty: Difficulty;
  video_url: string | null;
  primary_muscles: string[];
  secondary_muscles: string[];
};

export function useCreateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ExerciseInput): Promise<Exercise> => {
      const { data, error } = await supabase
        .from('exercises')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as Exercise;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useUpdateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; input: ExerciseInput }) => {
      const { error } = await supabase
        .from('exercises')
        .update(params.input)
        .eq('id', params.id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['exercises'] });
      qc.invalidateQueries({ queryKey: ['exercise', vars.id] });
    },
  });
}

export function useDeleteExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('exercises').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}
