import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Exercise } from '@/types/domain';

type Filters = {
  muscleSlug?: string;
  search?: string;
};

export function useExercises(filters: Filters = {}) {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: async (): Promise<Exercise[]> => {
      let query = supabase.from('exercises').select('*').order('name');
      if (filters.muscleSlug) {
        query = query.contains('primary_muscles', [filters.muscleSlug]);
      }
      if (filters.search && filters.search.length > 0) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Exercise[];
    },
  });
}

export function useExercise(id: string | undefined) {
  return useQuery({
    queryKey: ['exercise', id],
    enabled: !!id,
    queryFn: async (): Promise<Exercise | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Exercise;
    },
  });
}
