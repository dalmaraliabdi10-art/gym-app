import { useState } from 'react';
import { Circle, Ellipse, G, Path, Rect, Svg } from 'react-native-svg';

import { MuscleGroup } from './MuscleGroup';
import type { MuscleSlug } from './muscles';

const BODY_FILL = '#2a2a2a';
const BODY_STROKE = '#444';
const MUSCLE_FILL = '#3b82f6';

type Props = {
  onPressMuscle: (slug: MuscleSlug) => void;
  width?: number | string;
  height?: number | string;
};

export function FrontBody({ onPressMuscle, width = '100%', height = '100%' }: Props) {
  const [hovered, setHovered] = useState<MuscleSlug | null>(null);

  return (
    <Svg viewBox="0 0 200 500" width={width} height={height}>
      {/* Body silhouette */}
      <G fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={1.2}>
        <Circle cx="100" cy="42" r="24" />
        <Path d="M 92,64 L 108,64 L 110,78 L 90,78 Z" />
        <Path d="M 60,78 Q 80,75 100,75 Q 120,75 140,78 L 142,150 L 136,210 L 132,275 L 68,275 L 64,210 L 58,150 Z" />
        <Path d="M 60,80 L 40,165 L 30,245 L 46,250 L 54,245 L 58,165 Z" />
        <Path d="M 140,80 L 160,165 L 170,245 L 154,250 L 146,245 L 142,165 Z" />
        <Path d="M 70,275 L 64,360 L 70,460 L 80,495 L 96,495 L 98,460 L 100,275 Z" />
        <Path d="M 100,275 L 102,460 L 104,495 L 120,495 L 130,460 L 136,360 L 130,275 Z" />
      </G>

      {/* Muscles (clickable) */}
      <G fill={MUSCLE_FILL} stroke={MUSCLE_FILL} strokeWidth={1}>
        <MuscleGroup slug="shoulders" hovered={hovered} setHovered={setHovered} onPress={onPressMuscle}>
          <Ellipse cx="70" cy="88" rx="11" ry="9" />
          <Ellipse cx="130" cy="88" rx="11" ry="9" />
        </MuscleGroup>
        <MuscleGroup slug="chest" hovered={hovered} setHovered={setHovered} onPress={onPressMuscle}>
          <Ellipse cx="86" cy="108" rx="16" ry="13" />
          <Ellipse cx="114" cy="108" rx="16" ry="13" />
        </MuscleGroup>
        <MuscleGroup slug="biceps" hovered={hovered} setHovered={setHovered} onPress={onPressMuscle}>
          <Ellipse cx="50" cy="130" rx="9" ry="22" />
          <Ellipse cx="150" cy="130" rx="9" ry="22" />
        </MuscleGroup>
        <MuscleGroup slug="forearms" hovered={hovered} setHovered={setHovered} onPress={onPressMuscle}>
          <Ellipse cx="40" cy="200" rx="9" ry="24" />
          <Ellipse cx="160" cy="200" rx="9" ry="24" />
        </MuscleGroup>
        <MuscleGroup slug="abs" hovered={hovered} setHovered={setHovered} onPress={onPressMuscle}>
          <Rect x="89" y="128" width="22" height="62" rx="5" />
        </MuscleGroup>
        <MuscleGroup slug="obliques" hovered={hovered} setHovered={setHovered} onPress={onPressMuscle}>
          <Path d="M 73,140 L 86,140 L 86,205 L 78,235 Z" />
          <Path d="M 127,140 L 114,140 L 114,205 L 122,235 Z" />
        </MuscleGroup>
        <MuscleGroup slug="quads" hovered={hovered} setHovered={setHovered} onPress={onPressMuscle}>
          <Ellipse cx="84" cy="320" rx="13" ry="38" />
          <Ellipse cx="116" cy="320" rx="13" ry="38" />
        </MuscleGroup>
      </G>
    </Svg>
  );
}
