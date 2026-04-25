import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { G } from 'react-native-svg';

import type { MuscleSlug } from './muscles';

type Props = {
  slug: MuscleSlug;
  hovered: MuscleSlug | null;
  setHovered: (slug: MuscleSlug | null) => void;
  onPress: (slug: MuscleSlug) => void;
  children: ReactNode;
};

export function MuscleGroup({ slug, hovered, setHovered, onPress, children }: Props) {
  const isHovered = hovered === slug;

  // onMouseEnter / onMouseLeave are forwarded by react-native-svg to the
  // underlying DOM element on web. They have no effect on native, where
  // hover does not exist. The cast bypasses missing types in react-native-svg.
  const webHoverProps =
    Platform.OS === 'web'
      ? {
          onMouseEnter: () => setHovered(slug),
          onMouseLeave: () => setHovered(null),
          style: { cursor: 'pointer' },
        }
      : {};

  return (
    <G
      onPress={() => onPress(slug)}
      fillOpacity={isHovered ? 0.9 : 0.55}
      strokeOpacity={isHovered ? 1 : 0.85}
      {...(webHoverProps as object)}
    >
      {children}
    </G>
  );
}
