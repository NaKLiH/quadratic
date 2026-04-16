import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { getRoots } from '../utils/quadratic';

const X_RANGE = 10; // show x from -10 to +10
const POINTS = 200;

function buildData(a, b, c) {
  const data = [];
  for (let i = 0; i <= POINTS; i++) {
    const x = -X_RANGE + (2 * X_RANGE * i) / POINTS;
    const aTerm = a * x * x;
    const bTerm = b * x;
    const y = aTerm + bTerm + c;
    data.push({
      x: parseFloat(x.toFixed(3)),
      y: parseFloat(y.toFixed(3)),
      aTerm: parseFloat(aTerm.toFixed(3)),
      bTerm: parseFloat(bTerm.toFixed(3)),
      c: c,
    });
  }
  return data;
}

function CustomDot({ cx, cy, selectedX, x }) {
  if (Math.abs(x - selectedX) < 0.2) {
    return <circle cx={cx} cy={cy} r={6} fill="#7c3aed" stroke="white" strokeWidth={2} />;
  }
  return null;
}

const CustomTooltip = ({ active, payload, label, onHover }) => {
  if (active && payload && payload.length) {
    if (onHover) onHover(label);
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-xs">
        <div className="font-bold text-slate-700 mb-1">x = {parseFloat(label.toFixed(2))}</div>
        <div className="text-violet-700 font-bold">y = {parseFloat(payload[0]?.value?.toFixed(2))}</div>
      </div>
    );
  }
  return null;
};

export default function ParabolaGraph({ a, b, c, selectedX, onSelectX }) {
  const data = buildData(a, b, c);
  const rootResult = getRoots(a, b, c);
  const roots = rootResult.type === 'real' ? [rootResult.r1, rootResult.r2]
              : rootResult.type === 'double' ? [rootResult.r1]
              : [];

  // Compute y domain from a window centred on the vertex, not the full ±10 range.
  // Without this, a parabola like x²−4x+3 (vertex y=−1, arms y=143) looks flat
  // because the arms dominate the scale and the tiny dip below the axis disappears.
  const xVertex = a !== 0 ? -b / (2 * a) : 0;
  const WINDOW = 5; // x units either side of vertex used for scale
  const windowData = data.filter(d => d.x >= xVertex - WINDOW && d.x <= xVertex + WINDOW);
  const scaleData = windowData.length >= 4 ? windowData : data;
  const yValues = scaleData.map((d) => d.y);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const range = yMax - yMin || 10;
  // Bottom: when the curve dips below zero keep it tight (1.5× the dip) so the
  // x-axis crossing is obvious, not buried in whitespace. Above zero use a small flat pad.
  const domainMin = yMin < 0
    ? Math.floor(yMin * 1.5)
    : Math.floor(yMin - Math.max(range * 0.1, 1));
  const domainMax = Math.ceil(yMax + Math.max(range * 0.12, 2));
  const yDomain = [domainMin, domainMax];

  const selectedY = a * selectedX * selectedX + b * selectedX + c;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-500 mb-1 uppercase tracking-wide text-sm">
        The Parabola
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        Click anywhere on the graph to explore that x value
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          onClick={(e) => {
            if (e && e.activeLabel !== undefined) {
              onSelectX(parseFloat(e.activeLabel));
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[-X_RANGE, X_RANGE]}
            tickCount={11}
            stroke="#94a3b8"
            tick={{ fontSize: 11 }}
            label={{ value: 'x', position: 'insideRight', offset: -5, fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            domain={yDomain}
            tickCount={6}
            stroke="#94a3b8"
            tick={{ fontSize: 11 }}
            width={50}
            label={{ value: 'y', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip onHover={onSelectX} />}
            cursor={{ stroke: '#7c3aed', strokeWidth: 1, strokeDasharray: '4 2' }}
          />
          <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.5} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />
          <ReferenceDot
            x={0} y={0} r={5}
            fill="#94a3b8" stroke="white" strokeWidth={2}
            label={{ value: 'O', position: 'insideBottomRight', fill: '#64748b', fontSize: 11, fontWeight: '600' }}
          />
          {/* Root markers */}
          {roots.map((r, i) => (
            <ReferenceLine
              key={i}
              x={r}
              stroke="#0d9488"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: `r${i + 1}=${parseFloat(r.toFixed(1))}`,
                position: 'bottom',
                fill: '#0d9488',
                fontSize: 10,
              }}
            />
          ))}
          {/* Selected x vertical line */}
          <ReferenceLine
            x={selectedX}
            stroke="#7c3aed"
            strokeWidth={2}
            strokeDasharray="4 3"
            label={{
              value: `x=${parseFloat(selectedX.toFixed(1))}`,
              position: 'top',
              fill: '#7c3aed',
              fontSize: 11,
            }}
          />
          {/* Selected point dot */}
          <ReferenceLine
            y={selectedY}
            stroke="#7c3aed"
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={0.5}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#7c3aed"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#7c3aed' }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Selected point callout + roots summary */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-2 text-sm text-violet-700 font-medium">
          📍 At x = {parseFloat(selectedX.toFixed(2))}, y = {parseFloat(selectedY.toFixed(2))}
        </div>
        {roots.length > 0 && roots.map((r, i) => (
          <button
            key={i}
            onClick={() => onSelectX(parseFloat(r.toFixed(2)))}
            className="bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 text-sm text-teal-700 font-medium hover:bg-teal-100 transition-colors"
          >
            🎯 Root {i + 1}: x = {parseFloat(r.toFixed(2))}
          </button>
        ))}
        {roots.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-700">
            No real roots (parabola doesn&apos;t cross x-axis)
          </div>
        )}
      </div>
    </div>
  );
}
