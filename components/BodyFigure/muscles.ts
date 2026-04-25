export type MuscleSlug =
  | 'chest'
  | 'shoulders'
  | 'biceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'traps'
  | 'lats'
  | 'triceps'
  | 'lower_back'
  | 'glutes'
  | 'hamstrings'
  | 'calves';

export type MuscleMeta = {
  slug: MuscleSlug;
  name_sv: string;
  name_en: string;
  region: 'front' | 'back';
};

export const MUSCLES: Record<MuscleSlug, MuscleMeta> = {
  chest:       { slug: 'chest',       name_sv: 'Bröst',              name_en: 'Chest',      region: 'front' },
  shoulders:   { slug: 'shoulders',   name_sv: 'Axlar',              name_en: 'Shoulders',  region: 'front' },
  biceps:      { slug: 'biceps',      name_sv: 'Biceps',             name_en: 'Biceps',     region: 'front' },
  forearms:    { slug: 'forearms',    name_sv: 'Underarmar',         name_en: 'Forearms',   region: 'front' },
  abs:         { slug: 'abs',         name_sv: 'Magmuskler',         name_en: 'Abs',        region: 'front' },
  obliques:    { slug: 'obliques',    name_sv: 'Sneda magmuskler',   name_en: 'Obliques',   region: 'front' },
  quads:       { slug: 'quads',       name_sv: 'Lårmuskler (fram)',  name_en: 'Quadriceps', region: 'front' },
  traps:       { slug: 'traps',       name_sv: 'Kappmuskler',        name_en: 'Trapezius',  region: 'back' },
  lats:        { slug: 'lats',        name_sv: 'Breda ryggmuskeln',  name_en: 'Lats',       region: 'back' },
  triceps:     { slug: 'triceps',     name_sv: 'Triceps',            name_en: 'Triceps',    region: 'back' },
  lower_back:  { slug: 'lower_back',  name_sv: 'Nedre rygg',         name_en: 'Lower Back', region: 'back' },
  glutes:      { slug: 'glutes',      name_sv: 'Sätesmuskler',       name_en: 'Glutes',     region: 'back' },
  hamstrings:  { slug: 'hamstrings',  name_sv: 'Lårmuskler (bak)',   name_en: 'Hamstrings', region: 'back' },
  calves:      { slug: 'calves',      name_sv: 'Vadmuskler',         name_en: 'Calves',     region: 'back' },
};

export const MUSCLE_LIST: MuscleMeta[] = Object.values(MUSCLES);
