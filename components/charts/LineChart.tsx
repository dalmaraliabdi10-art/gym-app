import { StyleSheet, Text, View } from 'react-native';
import { Circle, Line, Path, Svg, Text as SvgText } from 'react-native-svg';

export type Point = { x: number; y: number; label?: string };

type Props = {
  data: Point[];
  height?: number;
  yLabel?: string;
};

const PADDING = { left: 32, right: 12, top: 12, bottom: 24 };
const VIEW_W = 400;
const STROKE = '#3b82f6';
const GRID = '#2a2a2a';
const TEXT = '#888';

export function LineChart({ data, height = 200, yLabel }: Props) {
  if (data.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={styles.emptyText}>Ingen data ännu</Text>
      </View>
    );
  }

  const VIEW_H = height;
  const innerW = VIEW_W - PADDING.left - PADDING.right;
  const innerH = VIEW_H - PADDING.top - PADDING.bottom;

  const xs = data.map((p) => p.x);
  const ys = data.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = 0;
  const rawMaxY = Math.max(...ys);
  const maxY = rawMaxY > 0 ? Math.ceil((rawMaxY * 1.1) / 5) * 5 : 10;

  const xScale = (x: number) =>
    PADDING.left + (maxX === minX ? innerW / 2 : ((x - minX) / (maxX - minX)) * innerW);
  const yScale = (y: number) => PADDING.top + innerH - ((y - minY) / (maxY - minY)) * innerH;

  const points = data.map((p) => ({ x: xScale(p.x), y: yScale(p.y), label: p.label }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // 3 horizontal grid lines: 0%, 50%, 100% of maxY
  const gridYs = [maxY, maxY / 2, 0];

  return (
    <View>
      <Svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width="100%" height={VIEW_H}>
        {gridYs.map((value, i) => (
          <Line
            key={i}
            x1={PADDING.left}
            x2={VIEW_W - PADDING.right}
            y1={yScale(value)}
            y2={yScale(value)}
            stroke={GRID}
            strokeWidth={0.5}
          />
        ))}
        {gridYs.map((value, i) => (
          <SvgText
            key={`label-${i}`}
            x={PADDING.left - 4}
            y={yScale(value) + 4}
            textAnchor="end"
            fill={TEXT}
            fontSize={10}
          >
            {Math.round(value)}
          </SvgText>
        ))}
        <Path d={pathD} stroke={STROKE} strokeWidth={2} fill="none" />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={STROKE} />
        ))}
      </Svg>
      {yLabel && <Text style={styles.yLabel}>{yLabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#666', fontSize: 13 },
  yLabel: { color: '#888', fontSize: 11, textAlign: 'center', marginTop: 4 },
});
