// Shows the quadratic equation ax² + bx + c with color-coded terms
import { COLORS } from '../constants/colors';

export default function EquationDisplay({ a, b, c, selectedX }) {
  const yValue = a * selectedX * selectedX + b * selectedX + c;
  const aTerm = a * selectedX * selectedX;
  const bTerm = b * selectedX;

  const fmt = (n) => parseFloat(n.toFixed(2));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-500 mb-3 uppercase tracking-wide text-sm">
        The Equation
      </h2>

      {/* Algebraic form */}
      <div className="text-3xl font-bold mb-4 flex items-baseline justify-center gap-1 flex-wrap">
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

      {/* At the selected x value */}
      <div className="bg-slate-50 rounded-xl p-4 text-sm">
        <div className="text-slate-500 mb-2 font-medium">
          When x = <span className="font-bold text-slate-700">{fmt(selectedX)}</span>:
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-sm inline-block shrink-0 border ${COLORS.a.swatch}`} />
            <span className={`${COLORS.a.label} font-medium`}>
              {fmt(a)}× ({fmt(selectedX)})² = <strong>{fmt(aTerm)}</strong>
            </span>
          </div>
          {b !== 0 && (
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-sm inline-block shrink-0 border ${COLORS.b.swatch}`} />
              <span className={`${COLORS.b.label} font-medium`}>
                {fmt(b)}× {fmt(selectedX)} = <strong>{fmt(bTerm)}</strong>
              </span>
            </div>
          )}
          {c !== 0 && (
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-sm inline-block shrink-0 border ${COLORS.c.swatch}`} />
              <span className={`${COLORS.c.label} font-medium`}>
                constant = <strong>{fmt(c)}</strong>
              </span>
            </div>
          )}
          <div className="border-t border-slate-200 mt-1 pt-1 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full inline-block shrink-0 border ${COLORS.y.swatch}`} />
            <span className={`${COLORS.y.label} font-bold`}>y = {fmt(yValue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
