export type MuscleRegion = 'front' | 'back';

export type MuscleGroup = {
  slug: string;
  name_sv: string;
  name_en: string;
  region: MuscleRegion;
};

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Exercise = {
  id: string;
  name: string;
  description: string | null;
  form_tips: string[];
  equipment: string;
  difficulty: Difficulty;
  video_url: string | null;
  primary_muscles: string[];
  secondary_muscles: string[];
};

export type Workout = {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  notes: string | null;
};

export type WorkoutSet = {
  id: string;
  workout_id: string;
  exercise_id: string;
  set_index: number;
  reps: number | null;
  weight_kg: number | null;
  rpe: number | null;
  completed_at: string;
};
