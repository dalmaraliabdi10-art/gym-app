import { Circle, Ellipse, G, Path, Rect, Svg } from 'react-native-svg';
import type { MuscleSlug } from './muscles';

const BODY_FILL = '#2a2a2a';
const BODY_STROKE = '#444';
const MUSCLE_FILL = '#3b82f6';
const MUSCLE_OPACITY = 0.55;

type Props = {
  onPressMuscle: (slug: MuscleSlug) => void;
  width?: number | string;
  height?: number | string;
};

export function BackBody({ onPressMuscle, width = '100%', height = '100%' }: Props) {
  return (
    <Svg viewBox="0 0 200 500" width={width} height={height}>
      {/* Body silhouette (same shape as front) */}
      <G fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={1.2}>
        <Circle cx="100" cy="42" r="24" />
        <Path d="M 92,64 L 108,64 L 110,78 L 90,78 Z" />
        <Path d="M 60,78 Q 80,75 100,75 Q 120,75 140,78 L 142,150 L 136,210 L 132,275 L 68,275 L 64,210 L 58,150 Z" />
        <Path d="M 60,80 L 40,165 L 30,245 L 46,250 L 54,245 L 58,165 Z" />
        <Path d="M 140,80 L 160,165 L 170,245 L 154,250 L 146,245 L 142,165 Z" />
        <Path d="M 70,275 L 64,360 L 70,460 L 80,495 L 96,495 L 98,460 L 100,275 Z" />
        <Path d="M 100,275 L 102,460 L 104,495 L 120,495 L 130,460 L 136,360 L 130,275 Z" />
      </G>

      {/* Muscles (clickable) — back view */}
      <G fill={MUSCLE_FILL} fillOpacity={MUSCLE_OPACITY} stroke={MUSCLE_FILL} strokeOpacity={0.9} strokeWidth={1}>
        <G onPress={() => onPressMuscle('traps')}>
          <Path d="M 80,80 L 120,80 L 115,115 L 100,108 L 85,115 Z" />
        </G>
        <G onPress={() => onPressMuscle('lats')}>
          <Path d="M 65,115 L 95,115 L 92,200 L 70,180 Z" />
          <Path d="M 135,115 L 105,115 L 108,200 L 130,180 Z" />
        </G>
        <G onPress={() => onPressMuscle('triceps')}>
          <Ellipse cx="50" cy="135" rx="9" ry="24" />
          <Ellipse cx="150" cy="135" rx="9" ry="24" />
        </G>
        <G onPress={() => onPressMuscle('lower_back')}>
          <Rect x="86" y="200" width="28" height="40" rx="6" />
        </G>
        <G onPress={() => onPressMuscle('glutes')}>
          <Ellipse cx="86" cy="265" rx="16" ry="14" />
          <Ellipse cx="114" cy="265" rx="16" ry="14" />
        </G>
        <G onPress={() => onPressMuscle('hamstrings')}>
          <Ellipse cx="84" cy="330" rx="13" ry="35" />
          <Ellipse cx="116" cy="330" rx="13" ry="35" />
        </G>
        <G onPress={() => onPressMuscle('calves')}>
          <Ellipse cx="84" cy="420" rx="11" ry="32" />
          <Ellipse cx="116" cy="420" rx="11" ry="32" />
        </G>
      </G>
    </Svg>
  );
}
