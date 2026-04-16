// Sliders to interactively adjust a, b, c coefficients
import { COLORS } from '../constants/colors';

function Slider({ label, value, min, max, step, onChange, accentColor, labelClass, description }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className={`font-bold text-sm ${labelClass}`}>{label}</label>
        <span className={`font-mono font-bold text-base ${labelClass}`}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor }}
      />
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}

export default function InteractiveControls({ a, b, c, onChangeA, onChangeB, onChangeC }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-500 mb-4 uppercase tracking-wide text-sm">
        Adjust the Equation
      </h2>

      <div className="flex flex-col gap-5">
        <Slider
          label="a (x² coefficient)"
          value={a}
          min={-3} max={3} step={0.5}
          onChange={onChangeA}
          accentColor={COLORS.a.stroke}
          labelClass={COLORS.a.label}
          description="Controls how wide or narrow the parabola is. Negative flips it upside down!"
        />
        <Slider
          label="b (x coefficient)"
          value={b}
          min={-5} max={5} step={0.5}
          onChange={onChangeB}
          accentColor={COLORS.b.stroke}
          labelClass={COLORS.b.label}
          description="Shifts the parabola left or right"
        />
        <Slider
          label="c (constant)"
          value={c}
          min={-10} max={10} step={1}
          onChange={onChangeC}
          accentColor={COLORS.c.stroke}
          labelClass={COLORS.c.label}
          description="Moves the whole parabola up or down"
        />
      </div>

      <div className="mt-5 bg-slate-50 rounded-xl p-3 text-center">
        <div className="text-2xl font-bold flex items-baseline justify-center gap-1 flex-wrap">
          <span className={COLORS.a.label}>
            {a < 0 ? '−' : ''}{Math.abs(a) === 1 ? '' : Math.abs(a)}x²
          </span>
          <span className="text-slate-400">{b >= 0 ? '+' : '−'}</span>
          <span className={COLORS.b.label}>
            {Math.abs(b) === 1 ? '' : Math.abs(b)}x
          </span>
          <span className="text-slate-400">{c >= 0 ? '+' : '−'}</span>
          <span className={COLORS.c.label}>{Math.abs(c)}</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">y = ax² + bx + c</div>
      </div>
    </div>
  );
}
