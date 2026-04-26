import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { MUSCLES, MUSCLE_LIST, type MuscleSlug } from '@/components/BodyFigure/muscles';
import type { ExerciseInput } from '@/hooks/useAdmin';
import type { Difficulty, Exercise } from '@/types/domain';

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const EQUIPMENT_OPTIONS = ['bodyweight', 'barbell', 'dumbbell', 'cable', 'machine', 'kettlebell'];

type Props = {
  initial?: Exercise;
  onSubmit: (input: ExerciseInput) => void;
  submitting: boolean;
  submitLabel: string;
};

export function ExerciseForm({ initial, onSubmit, submitting, submitLabel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [equipment, setEquipment] = useState(initial?.equipment ?? 'bodyweight');
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? 'beginner');
  const [videoUrl, setVideoUrl] = useState(initial?.video_url ?? '');
  const [formTipsText, setFormTipsText] = useState(initial?.form_tips.join('\n') ?? '');
  const [primary, setPrimary] = useState<Set<string>>(
    new Set(initial?.primary_muscles ?? []),
  );
  const [secondary, setSecondary] = useState<Set<string>>(
    new Set(initial?.secondary_muscles ?? []),
  );
  const [error, setError] = useState<string | null>(null);

  const togglePrimary = (slug: string) => {
    setPrimary((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else {
        next.add(slug);
        const sec = new Set(secondary);
        sec.delete(slug);
        setSecondary(sec);
      }
      return next;
    });
  };

  const toggleSecondary = (slug: string) => {
    setSecondary((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else {
        next.add(slug);
        const prim = new Set(primary);
        prim.delete(slug);
        setPrimary(prim);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Namn krävs');
      return;
    }
    if (primary.size === 0) {
      setError('Minst en primär muskel krävs');
      return;
    }
    setError(null);
    onSubmit({
      name: name.trim(),
      description: description.trim() || null,
      form_tips: formTipsText
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      equipment,
      difficulty,
      video_url: videoUrl.trim() || null,
      primary_muscles: Array.from(primary),
      secondary_muscles: Array.from(secondary),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Field label="Namn">
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="t.ex. Bench Press"
          placeholderTextColor="#666"
        />
      </Field>

      <Field label="Beskrivning">
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Kort beskrivning av övningen..."
          placeholderTextColor="#666"
          multiline
        />
      </Field>

      <Field label="Form-tips (en per rad)">
        <TextInput
          style={[styles.input, styles.multiline]}
          value={formTipsText}
          onChangeText={setFormTipsText}
          placeholder={'Dra ihop skulderbladen\nStången rör vid bröstet'}
          placeholderTextColor="#666"
          multiline
        />
      </Field>

      <Field label="Utrustning">
        <View style={styles.chipRow}>
          {EQUIPMENT_OPTIONS.map((eq) => (
            <Pressable
              key={eq}
              style={[styles.chip, equipment === eq && styles.chipActive]}
              onPress={() => setEquipment(eq)}
            >
              <Text style={[styles.chipText, equipment === eq && styles.chipTextActive]}>{eq}</Text>
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="Svårighetsgrad">
        <View style={styles.chipRow}>
          {DIFFICULTIES.map((d) => (
            <Pressable
              key={d}
              style={[styles.chip, difficulty === d && styles.chipActive]}
              onPress={() => setDifficulty(d)}
            >
              <Text style={[styles.chipText, difficulty === d && styles.chipTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="Primära muskler">
        <View style={styles.chipRow}>
          {MUSCLE_LIST.map((m) => (
            <Pressable
              key={m.slug}
              style={[styles.chip, primary.has(m.slug) && styles.chipPrimary]}
              onPress={() => togglePrimary(m.slug)}
            >
              <Text style={[styles.chipText, primary.has(m.slug) && styles.chipTextActive]}>
                {m.name_sv}
              </Text>
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="Sekundära muskler">
        <View style={styles.chipRow}>
          {MUSCLE_LIST.map((m) => (
            <Pressable
              key={m.slug}
              style={[styles.chip, secondary.has(m.slug) && styles.chipSecondary]}
              onPress={() => toggleSecondary(m.slug)}
            >
              <Text style={[styles.chipText, secondary.has(m.slug) && styles.chipTextActive]}>
                {MUSCLES[m.slug as MuscleSlug].name_sv}
              </Text>
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="Video-URL (valfritt)">
        <TextInput
          style={styles.input}
          value={videoUrl}
          onChangeText={setVideoUrl}
          placeholder="https://..."
          placeholderTextColor="#666"
          autoCapitalize="none"
          keyboardType="url"
        />
      </Field>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.submitButton, submitting && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitText}>{submitting ? 'Sparar...' : submitLabel}</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  field: { gap: 6 },
  label: { color: '#888', fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    padding: 12,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' },
  chipPrimary: { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' },
  chipSecondary: { backgroundColor: '#581c87', borderColor: '#a855f7' },
  chipText: { color: '#aaa', fontSize: 13, textTransform: 'capitalize' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  error: { color: '#ef4444', fontSize: 14 },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
