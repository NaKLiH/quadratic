// Factorisation Visualizer
// Shows y = a(x - r1)(x - r2) as a rectangle with sides (x-r1) and (x-r2)
// Area of rectangle = y value on the parabola
// When x = r1 or r2, one side collapses to 0 → that's a root!

import { useState } from 'react';
import { COLORS } from '../constants/colors';
import { getRoots } from '../utils/quadratic';

const SCALE = 22; // pixels per unit
const MAX_DIM = 9; // max display units per side

function clampDim(val, max) {
  return Math.max(-max, Math.min(max, val));
}

function fmt(n) {
  return parseFloat(n.toFixed(2));
}

function fmtSigned(n) {
  const v = fmt(n);
  return v >= 0 ? `+${v}` : `${v}`;
}

// "(x − 2)", "(x + 1)", or "x" when root is 0
function factorStr(r) {
  if (Math.abs(r) < 0.001) return 'x';
  const v = fmt(Math.abs(r));
  return r > 0 ? `(x − ${v})` : `(x + ${v})`;
}

// Inline label: "x = 4", "x − 2 = 1", "x + 1 = 3"
function dimLabel(r, val) {
  if (Math.abs(r) < 0.001) return `x = ${fmt(val)}`;
  const v = fmt(Math.abs(r));
  return r > 0 ? `x − ${v} = ${fmt(val)}` : `x + ${v} = ${fmt(val)}`;
}

function RootBadge({ label, value, color }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium ${color}`}>
      <span>{label}</span>
      <span className="font-mono font-bold">x = {fmt(value)}</span>
    </div>
  );
}

// ─── Step-by-step explanation of how factorisation is found ───────────────
function FactorisationSteps({ a, b, c, r1, r2, isDouble }) {
  const [open, setOpen] = useState(true);

  // Key relationships:  r1 + r2 = -b/a,  r1 × r2 = c/a
  const sumOfRoots = fmt(-b / a);
  const productOfRoots = fmt(c / a);
  const r1f = fmt(r1);
  const r2f = fmt(r2);

  // Factored form string using proper sign formatting
  const aPrefix = Math.abs(a) === 1 ? (a < 0 ? '−' : '') : `${a}`;
  const factoredStr = isDouble
    ? `${aPrefix}${factorStr(r1)}²`
    : `${aPrefix}${factorStr(r1)}${factorStr(r2)}`;

  // For the "check by expanding" section
  const expandedB = fmt(-(r1 + r2) * a);
  const expandedC = fmt(r1 * r2 * a);

  return (
    <div className="mt-5 border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="font-semibold text-slate-700 text-sm">
          📖 How do we find the factorised form? (step by step)
        </span>
        <span className="text-slate-400 text-lg">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-4 flex flex-col gap-5 text-sm">

          {/* Big idea */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <div className="font-bold text-violet-800 mb-2">💡 The Big Idea</div>
            <p className="text-violet-700 leading-relaxed">
              A quadratic equation is secretly a <strong>rectangle in disguise</strong>!
              Instead of thinking about it as <em>x² + bx + c</em>, we want to find two
              lengths — the <span className={`font-bold ${COLORS.f1.label}`}>width</span> and
              the <span className={`font-bold ${COLORS.f2.label}`}>height</span> — so that
              their product (the area) equals y at every x.
            </p>
            <div className="mt-3 flex items-center justify-center gap-3 font-mono text-sm flex-wrap">
              <span className="bg-white border border-violet-200 rounded px-2 py-1 text-violet-700 font-bold">
                {a !== 1 && a !== -1 ? `${a}x² ${fmtSigned(b)}x ${fmtSigned(c)}` : `x² ${fmtSigned(b)}x ${fmtSigned(c)}`}
              </span>
              <span className="text-slate-400 font-bold">→</span>
              <span className={`bg-white border rounded px-2 py-1 font-bold ${COLORS.f1.border} ${COLORS.f1.label}`}>
                width
              </span>
              <span className="text-slate-400">×</span>
              <span className={`bg-white border rounded px-2 py-1 font-bold ${COLORS.f2.border} ${COLORS.f2.label}`}>
                height
              </span>
            </div>
          </div>

          {/* Step 1: The secret of the roots */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">1</span>
              <span className="font-bold text-slate-700">The two sides are both "x minus a number"</span>
            </div>
            <p className="text-slate-600 leading-relaxed ml-7">
              We write the rectangle sides as <strong>(x − r₁)</strong> and <strong>(x − r₂)</strong>.
              The numbers r₁ and r₂ are called the <strong>roots</strong> — the x-values where the
              parabola touches zero (where the rectangle collapses flat!).
            </p>
            <div className="ml-7 mt-2 flex flex-wrap gap-2">
              <div className={`rounded-lg px-3 py-1.5 text-sm font-mono font-bold ${COLORS.f1.badge}`}>
                width = {factorStr(r1)}
              </div>
              <div className={`rounded-lg px-3 py-1.5 text-sm font-mono font-bold ${COLORS.f2.badge}`}>
                height = {factorStr(r2)}
              </div>
            </div>
          </div>

          {/* Step 2: The two clues */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">2</span>
              <span className="font-bold text-slate-700">Two clues help us find the roots</span>
            </div>
            <p className="text-slate-600 leading-relaxed ml-7 mb-3">
              There are two magical rules about the roots that come from the equation itself:
            </p>
            <div className="ml-7 flex flex-col gap-2">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="font-bold text-amber-700 mb-1">🧩 Clue 1 — They add to {sumOfRoots}</div>
                <div className="font-mono text-amber-800 text-sm">
                  r₁ + r₂ = −b÷a = −({b})÷{a} = <strong>{sumOfRoots}</strong>
                </div>
                <div className="text-amber-600 text-xs mt-1">
                  Check: {r1f} + {r2f} = <strong>{fmt(r1 + r2)}</strong> ✓
                </div>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                <div className="font-bold text-sky-700 mb-1">🧩 Clue 2 — They multiply to {productOfRoots}</div>
                <div className="font-mono text-sky-800 text-sm">
                  r₁ × r₂ = c÷a = {c}÷{a} = <strong>{productOfRoots}</strong>
                </div>
                <div className="text-sky-600 text-xs mt-1">
                  Check: {r1f} × {r2f} = <strong>{fmt(r1 * r2)}</strong> ✓
                </div>
              </div>
            </div>
            {Math.abs(a) === 1 && (
              <p className="ml-7 mt-2 text-xs text-slate-500">
                💡 When a = {a}, this means: find two numbers that <em>add</em> to <strong>{fmt(-b)}</strong> and <em>multiply</em> to <strong>{fmt(c)}</strong>. That&apos;s the classic factorisation puzzle!
              </p>
            )}
          </div>

          {/* Step 3: The factored form */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">3</span>
              <span className="font-bold text-slate-700">Write out the rectangle</span>
            </div>
            <p className="text-slate-600 leading-relaxed ml-7 mb-2">
              Now we put the roots into the brackets. The two sides of the rectangle are:
            </p>
            <div className="ml-7 bg-teal-50 border border-teal-200 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold font-mono" style={{ color: COLORS.f1.text }}>
                {factoredStr}
              </div>
              <div className="text-xs text-teal-600 mt-1">
                This is exactly the same as the original equation — just written differently!
              </div>
            </div>
          </div>

          {/* Step 4: Check by expanding */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-violet-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">4</span>
              <span className="font-bold text-slate-700">Check it — expand back out!</span>
            </div>
            <p className="text-slate-600 leading-relaxed ml-7 mb-2">
              Multiply the two brackets together (like multiplying two sides of the rectangle to get the area) and you should get the original equation back:
            </p>
            <div className="ml-7 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono leading-relaxed text-slate-700">
              <div className="mb-1">
                <span className={COLORS.f1.label}>{factorStr(r1)}</span> × <span className={COLORS.f2.label}>{factorStr(r2)}</span>
              </div>
              <div className="text-slate-400 mb-1">Multiply every part of the first bracket by every part of the second:</div>
              <div className="mb-1">= x·x  {fmtSigned(-r2f)}·x  {fmtSigned(-r1f)}·x  + ({r1f})·({r2f})</div>
              <div className="mb-1">= <span className={COLORS.a.label}>x²</span>  <span className={COLORS.b.label}>{fmtSigned(expandedB !== '0' ? expandedB : 0)}x</span>  <span className={COLORS.c.label}>{fmtSigned(expandedC)}</span></div>
              {a !== 1 && <div className="text-slate-400 text-xs">(then multiply all by {a})</div>}
              <div className="mt-1 pt-1 border-t border-slate-200 font-bold text-slate-700">
                ✅ Same as the original: {a !== 1 && a !== -1 ? `${a}` : a === -1 ? '−' : ''}x²
                {b !== 0 ? ` ${fmtSigned(b)}x` : ''}
                {c !== 0 ? ` ${fmtSigned(c)}` : ''}
              </div>
            </div>
          </div>

          {/* The rectangle summary */}
          <div className="bg-gradient-to-r from-teal-50 to-purple-50 border border-teal-200 rounded-xl p-4">
            <div className="font-bold text-slate-700 mb-2 text-center">🟩 The Rectangle Summary</div>
            <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
              <div className="text-center">
                <div className={`font-mono font-bold ${COLORS.f1.label}`}>width = {factorStr(r1)}</div>
                <div className="text-xs text-slate-400">shrinks to 0 when x = {r1f}</div>
              </div>
              <div className="text-slate-400 font-bold text-lg">×</div>
              <div className="text-center">
                <div className={`font-mono font-bold ${COLORS.f2.label}`}>
                  height = {a !== 1 ? `${a}·` : ''}{factorStr(r2)}
                </div>
                <div className="text-xs text-slate-400">
                  {a !== 1 && <span className="text-purple-500 font-semibold">×{a} </span>}
                  shrinks to 0 when x = {r2f}
                </div>
              </div>
              <div className="text-slate-400 font-bold text-lg">=</div>
              <div className="text-center">
                <div className="font-mono font-bold text-violet-700">area = y</div>
                <div className="text-xs text-slate-400">= 0 at both roots</div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}


export default function FactorisationVisualizer({ a, b, c, selectedX }) {
  const roots = getRoots(a, b, c);
  const y = a * selectedX * selectedX + b * selectedX + c;

  // Factored form string
  const factored = () => {
    if (roots.type === 'complex') return null;
    const aStr = Math.abs(a) === 1 ? (a < 0 ? '−' : '') : `${a}`;
    if (roots.type === 'double') {
      return `${aStr}${factorStr(roots.r1)}²`;
    }
    const { r1, r2 } = roots;
    return `${aStr}${factorStr(r1)}${factorStr(r2)}`;
  };

  if (roots.type === 'complex') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">
          Factorisation
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
          <div className="text-amber-700 font-bold mb-1">🔍 This one can't be factorised (yet!)</div>
          <p className="text-amber-600">
            The parabola never crosses the x-axis — it has no real roots. That means we can't write it as
            (x − r₁)(x − r₂) using normal numbers. You'd need <em>complex numbers</em> for that — a topic
            for later!
          </p>
          <div className="mt-2 text-xs text-amber-500 font-mono">
            Discriminant b²−4ac = {fmt(roots.disc)} (negative → no real roots)
          </div>
        </div>
      </div>
    );
  }

  if (roots.type === 'none') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">
          Factorisation
        </h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
          Set a ≠ 0 to see factorisation.
        </div>
      </div>
    );
  }

  const { r1, r2 } = roots.type === 'double'
    ? { r1: roots.r1, r2: roots.r2 }
    : roots;

  // Rectangle dimensions at current x
  // width  = (x - r1)        — pure first factor
  // height = a · (x - r2)    — second factor × leading coefficient
  // area   = width × height  = a·(x−r1)·(x−r2) = y  ✓
  const rawW    = selectedX - r1;
  const rawH    = selectedX - r2;
  const rawAH   = a * rawH;                          // height including a
  const displayW  = Math.abs(clampDim(rawW,    MAX_DIM)) * SCALE;
  const displayH  = Math.abs(clampDim(rawAH,   MAX_DIM)) * SCALE;
  const guideH    = Math.abs(clampDim(rawH,    MAX_DIM)) * SCALE;  // dashed guide
  const hasAScale = Math.abs(a - 1) > 0.01;

  const svgW = MAX_DIM * SCALE + 60;
  const svgH = MAX_DIM * SCALE + 60;
  const rectX = 30;
  const rectY = 30;

  // Color: positive area = teal, negative area = rose
  const isAtRoot = Math.abs(y) < 0.05;
  const isPositive = y >= 0;
  const rectFill = isAtRoot
    ? 'rgba(148,163,184,0.2)'
    : isPositive
    ? 'rgba(20,184,166,0.2)'
    : 'rgba(251,113,133,0.2)';
  const rectStroke = isAtRoot ? '#94a3b8' : isPositive ? COLORS.f1.stroke : '#f43f5e';

  const labelW = fmt(Math.abs(rawW));
  const labelH = fmt(Math.abs(rawH));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">
        Factorisation
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        The equation can be written as two brackets multiplied together. Their product = y!
      </p>

      {/* Factored form */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-center mb-4">
        <div className={`text-xs ${COLORS.f1.label} mb-1 font-medium`}>Factored form</div>
        <div className={`text-xl font-bold font-mono`} style={{ color: COLORS.f1.text }}>{factored()}</div>
        <div className={`text-xs ${COLORS.f1.label} mt-1`}>
          = <span className="font-bold">{fmt(y)}</span> when x = {fmt(selectedX)}
        </div>
      </div>

      {/* Root badges */}
      <div className="flex flex-wrap gap-2 justify-center mb-5">
        <RootBadge label="Root 1:" value={r1} color="bg-rose-50 border-rose-200 text-rose-700" />
        {roots.type !== 'double' && (
          <RootBadge label="Root 2:" value={r2} color={`${COLORS.f2.badge} border ${COLORS.f2.swatch}`} />
        )}
      </div>

      {/* Rectangle visualization */}
      <div className="flex flex-col items-center">
        <div className="text-xs text-slate-500 mb-2 font-medium">
          {hasAScale
            ? `y as a rectangle — (x−r₁) × a·(x−r₂) = area = y`
            : `y as a rectangle — width × height = area = y`}
        </div>
        <div className="overflow-auto">
          <svg
            width={svgW}
            height={svgH}
            className="overflow-visible"
          >
            {/* Grid lines for context */}
            <line x1={rectX} y1={0} x2={rectX} y2={svgH} stroke="#f1f5f9" strokeWidth={1} />
            <line x1={0} y1={rectY} x2={svgW} y2={rectY} stroke="#f1f5f9" strokeWidth={1} />

            {/* The rectangle */}
            {displayW > 0 || displayH > 0 ? (
              <>
                {/* Dashed guide: pure (x-r1)×(x-r2) without a, shown when a≠1 */}
                {hasAScale && displayW > 2 && guideH > 2 && (
                  <rect
                    x={rectX} y={rectY} width={displayW} height={guideH}
                    fill="none" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 3" rx={4}
                  />
                )}
                <rect
                  x={rectX}
                  y={rectY}
                  width={Math.max(displayW, 2)}
                  height={Math.max(displayH, 2)}
                  fill={rectFill}
                  stroke={rectStroke}
                  strokeWidth={2}
                  rx={4}
                  style={{ transition: 'all 0.25s ease' }}
                />
                {/* ×a badge when a≠1 — sits above the width label */}
                {hasAScale && (
                  <text x={rectX + displayW / 2} y={rectY - 22}
                    textAnchor="middle" fontSize={10} fill="#7c3aed" fontWeight="bold">
                    ×{fmt(a)}
                  </text>
                )}
                {/* Width label (top) — just above the rectangle */}
                <text
                  x={rectX + displayW / 2}
                  y={rectY - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill={COLORS.f1.text}
                  fontWeight="600"
                >
                  {dimLabel(r1, Math.abs(rawW))}
                </text>
                {/* Height label (right) */}
                <text
                  x={rectX + displayW + 8}
                  y={rectY + displayH / 2}
                  textAnchor="start"
                  fontSize={11}
                  fill={COLORS.f2.text}
                  fontWeight="600"
                  dominantBaseline="middle"
                >
                  {hasAScale
                    ? `${fmt(a)}·${factorStr(r2).replace(/[()]/g,'')} = ${fmt(Math.abs(rawAH))}`
                    : dimLabel(r2, Math.abs(rawH))}
                </text>
                {/* Guide label — only when enough vertical gap to avoid overlap */}
                {hasAScale && guideH > 12 && Math.abs(guideH - displayH) > 22 && (
                  <text x={rectX + displayW + 8} y={rectY + guideH / 2}
                    textAnchor="start" fontSize={9} fill="#94a3b8" dominantBaseline="middle">
                    {dimLabel(r2, Math.abs(rawH))}
                  </text>
                )}
                {/* Area label (center) — only when rect is large enough */}
                {displayW > 50 && displayH > 30 && (
                  <text
                    x={rectX + displayW / 2}
                    y={rectY + displayH / 2}
                    textAnchor="middle"
                    fontSize={12}
                    fill={isPositive ? COLORS.f1.text : '#f43f5e'}
                    fontWeight="bold"
                    dominantBaseline="middle"
                  >
                    Area = {fmt(Math.abs(y))}
                  </text>
                )}
              </>
            ) : (
              /* Collapsed rectangle at a root */
              <g>
                {/* Show as a line when one dimension is 0 */}
                <line
                  x1={rectX}
                  y1={rectY}
                  x2={rectX + Math.max(displayW, 1)}
                  y2={rectY + Math.max(displayH, 1)}
                  stroke="#94a3b8"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <text
                  x={rectX + 10}
                  y={rectY - 10}
                  fontSize={12}
                  fill="#64748b"
                  fontWeight="600"
                >
                  Area = 0 (at a root! 🎯)
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Root explanation */}
        {isAtRoot && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 font-medium text-center">
            🎯 You&apos;re at a root! One side of the rectangle = 0, so the area = 0, so y = 0.
            That&apos;s why the parabola touches the x-axis here!
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="mt-4 bg-slate-50 rounded-xl p-3 text-xs text-slate-600 leading-relaxed">
        <strong>Why this works:</strong> When we write y = {factorStr(r1)}{factorStr(r2)}, the two
        brackets are the <span className={`${COLORS.f1.label} font-semibold`}>width</span> and{' '}
        <span className={`${COLORS.f2.label} font-semibold`}>height</span> of a rectangle. Multiplying
        them gives the <strong>area</strong> — which equals y! Drag x to{' '}
        <span className="font-bold">{fmt(r1)}</span> or{' '}
        <span className="font-bold">{roots.type !== 'double' ? fmt(r2) : fmt(r1)}</span> to see the
        rectangle collapse to zero.
      </div>

      {/* Step-by-step explanation */}
      <FactorisationSteps a={a} b={b} c={c} r1={r1} r2={r2} isDouble={roots.type === 'double'} />
    </div>
  );
}
