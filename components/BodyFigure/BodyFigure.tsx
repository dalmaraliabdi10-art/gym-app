import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackBody } from './BackBody';
import { FrontBody } from './FrontBody';
import type { MuscleSlug } from './muscles';

type Props = {
  onPressMuscle: (slug: MuscleSlug) => void;
};

type BodyView = 'front' | 'back';

export function BodyFigure({ onPressMuscle }: Props) {
  const [view, setView] = useState<BodyView>('front');

  return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        <ToggleButton label="Front" active={view === 'front'} onPress={() => setView('front')} />
        <ToggleButton label="Back" active={view === 'back'} onPress={() => setView('back')} />
      </View>
      <View style={styles.figure}>
        {view === 'front' ? (
          <FrontBody onPressMuscle={onPressMuscle} />
        ) : (
          <BackBody onPressMuscle={onPressMuscle} />
        )}
      </View>
    </View>
  );
}

function ToggleButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.toggleButton, active && styles.toggleButtonActive]}
    >
      <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  toggleButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleButtonActive: { backgroundColor: '#2563eb' },
  toggleLabel: { color: '#888', fontSize: 14, fontWeight: '600' },
  toggleLabelActive: { color: '#fff' },
  figure: { flex: 1, width: '100%', maxWidth: 400, alignSelf: 'center' },
});
