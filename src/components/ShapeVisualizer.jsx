// Unified Shape Visualizer
// Shows: [x² square] + [bx bar] + [c bar] = [y as factored rectangle OR bar]
// All shapes use consistent colors from the shared color system

import { COLORS } from '../constants/colors';
import { getRoots as computeRoots } from '../utils/quadratic';

const SCALE = 18;
const MAX_U = 11;
const SVG_H = MAX_U * SCALE + 50;
const BASE = SVG_H - 24;

// Algebra tile model: all shapes use √|a|·|x| as the linear unit.
// This means every shape's area = its term value, all on the same scale.
const sa = (a) => Math.sqrt(Math.abs(a));
// Canonical tile height: √|a| · |x| · SCALE  (same for x², bx rect, and y rect)
function tileH(a, x) { return Math.min(sa(a) * Math.abs(x), MAX_U) * SCALE; }


function fmt(n) { return parseFloat(n.toFixed(2)); }
function clampU(v) { return Math.min(Math.abs(v), MAX_U); }
// "(x−2)", "(x+1)", or "x" when root is 0
function factorStr(r) {
  if (Math.abs(r) < 0.001) return 'x';
  const v = fmt(Math.abs(r));
  return r > 0 ? `(x−${v})` : `(x+${v})`;
}
// Dimension label: "x=4", "x−2=1", "x+1=3"
function dimLabel(r, val) {
  if (Math.abs(r) < 0.001) return `x=${fmt(val)}`;
  const v = fmt(Math.abs(r));
  return r > 0 ? `x−${v}=${fmt(val)}` : `x+${v}=${fmt(val)}`;
}

// ─── x² as a SQUARE ───────────────────────────────────────────────────────
function SquareShape({ a, x }) {
  const val = a * x * x;
  const side = clampU(Math.sqrt(Math.abs(a)) * Math.abs(x)) * SCALE;
  const sideUnits = fmt(Math.sqrt(Math.abs(a)) * Math.abs(x));
  const col = COLORS.a;
  const svgW = Math.max(side + 30, 60);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`text-xs font-bold ${col.label}`}>x² term</div>
      <svg width={svgW} height={SVG_H} className="overflow-visible">
        <rect
          x={10} y={BASE - side} width={side} height={side}
          fill={col.fill} stroke={col.stroke} strokeWidth={2} rx={3}
          style={{ transition: 'all 0.25s ease' }}
        />
        {side > 18 && (
          <>
            <text x={10 + side / 2} y={BASE - side - 5} textAnchor="middle" fontSize={9} fill={col.text} fontWeight="600">
              {sideUnits}
            </text>
            <text x={10 + side + 5} y={BASE - side / 2} fontSize={9} fill={col.text} fontWeight="600" dominantBaseline="middle">
              {sideUnits}
            </text>
          </>
        )}
        {side === 0 && <text x={30} y={BASE - 5} textAnchor="middle" fontSize={10} fill="#94a3b8">0</text>}
        <line x1={0} y1={BASE} x2={svgW} y2={BASE} stroke="#e2e8f0" strokeWidth={1} />
      </svg>
      <div className={`text-xs font-bold ${col.label}`}>{fmt(val)}</div>
      <div className="text-xs text-slate-400">{a}x²</div>
    </div>
  );
}

// ─── bx as a RECTANGLE: height = |x| (matches square side), width = |b| ──────
// For x²+2x this means a 2×x rect sits alongside the x×x square,
// making a combined (x+2)×x rectangle — the algebra tile model.
function LinearBar({ a, b, x }) {
  const val = b * x;
  const isNeg = val < 0;
  const sqA = Math.max(sa(a), 0.001);

  // Height matches the x² square side exactly
  const h = tileH(a, x);
  const hUnits = fmt(sqA * Math.abs(x));         // label: the height dimension

  // Width = |b| / √|a| in x-units, so area = h × w = (√a·x)(b/√a) = bx ✓
  const wUnits = Math.min(Math.abs(b) / sqA, MAX_U);
  const w = wUnits * SCALE;
  const wLabel = fmt(wUnits);                     // label: the width dimension

  const col = COLORS.b;
  const svgW = Math.max(w + 36, 50);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`text-xs font-bold ${col.label}`}>x term</div>
      <svg width={svgW} height={SVG_H} className="overflow-visible">
        {/* The rectangle: width = |b|, height = |x| */}
        <rect
          x={8} y={isNeg ? BASE : BASE - h}
          width={Math.max(w, 2)} height={Math.max(h, 2)}
          fill={col.fill} stroke={col.stroke} strokeWidth={2} rx={3}
          style={{ transition: 'all 0.25s ease' }}
        />
        {/* Width label on the top/bottom edge */}
        {w > 10 && h > 0 && (
          <text x={8 + w / 2} y={isNeg ? BASE + h + 14 : BASE - h - 5}
            textAnchor="middle" fontSize={9} fill={col.text} fontWeight="600">
            {wLabel}
          </text>
        )}
        {/* Height label on the right side */}
        {h > 20 && (
          <text x={8 + w + 5} y={isNeg ? BASE + h / 2 : BASE - h / 2}
            fontSize={9} fill={col.text} fontWeight="600" dominantBaseline="middle">
            {hUnits}
          </text>
        )}
        {h === 0 && <text x={svgW / 2} y={BASE - 5} textAnchor="middle" fontSize={10} fill="#94a3b8">0</text>}
        <line x1={0} y1={BASE} x2={svgW} y2={BASE} stroke="#e2e8f0" strokeWidth={1} />
      </svg>
      <div className={`text-xs font-bold ${col.label}`}>{fmt(val)}</div>
      <div className="text-xs text-slate-400">{b}x</div>
    </div>
  );
}

// ─── c as a FLAT TILE: width = |c|, height = 1 unit ──────────────────────
// Visually: a short wide slab — the "unit tiles" of algebra
function ConstantBar({ c }) {
  const wUnits = Math.min(Math.abs(c), MAX_U);
  const w = wUnits * SCALE;
  const h = SCALE;                   // always 1 unit tall
  const col = COLORS.c;
  const svgW = Math.max(w + 30, 50);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`text-xs font-bold ${col.label}`}>constant</div>
      <svg width={svgW} height={SVG_H} className="overflow-visible">
        <rect
          x={8} y={c >= 0 ? BASE - h : BASE}
          width={Math.max(w, 2)} height={h}
          fill={col.fill} stroke={col.stroke} strokeWidth={2} rx={3}
          style={{ transition: 'all 0.25s ease' }}
        />
        {w > 10 && (
          <text x={8 + w / 2} y={c >= 0 ? BASE - h - 5 : BASE + h + 12}
            textAnchor="middle" fontSize={9} fill={col.text} fontWeight="600">
            {fmt(Math.abs(c))}
          </text>
        )}
        {w === 0 && <text x={svgW / 2} y={BASE - 5} textAnchor="middle" fontSize={10} fill="#94a3b8">0</text>}
        <line x1={0} y1={BASE} x2={svgW} y2={BASE} stroke="#e2e8f0" strokeWidth={1} />
      </svg>
      <div className={`text-xs font-bold ${col.label}`}>{fmt(c)}</div>
      <div className="text-xs text-slate-400">constant</div>
    </div>
  );
}

// ─── y as a FACTORED RECTANGLE ─────────────────────────────────────────────
// width  = (x - r1)        — the first factor, unscaled
// height = a · (x - r2)    — the second factor × leading coefficient
// area   = width × height  = a·(x−r1)·(x−r2) = y  ✓
// When a ≠ 1 a dashed guide shows where height |x−r2| alone would reach,
// making the a-scaling visually obvious.
const RECT_SCALE = 18;
const RECT_MAX = MAX_U;

function FactoredRect({ a, x, roots }) {
  const { r1, r2 } = roots;
  const f1 = x - r1;
  const f2 = x - r2;
  const y = a * f1 * f2;
  const isAtRoot = Math.abs(f1) < 0.08 || Math.abs(f2) < 0.08;
  const hasAScale = Math.abs(a - 1) > 0.01;

  // width = pure (x-r1) factor; height = a·(x-r2) so area = y
  const dispW  = Math.min(Math.abs(f1),       RECT_MAX) * RECT_SCALE;
  const dispH  = Math.min(Math.abs(a * f2),   RECT_MAX) * RECT_SCALE;
  // guide height = pure (x-r2), shown dashed when a ≠ 1
  const guideH = Math.min(Math.abs(f2),       RECT_MAX) * RECT_SCALE;

  const c1 = COLORS.f1;
  const c2 = COLORS.f2;
  const yCol = isAtRoot ? '#94a3b8' : y >= 0 ? COLORS.f1.stroke : '#f43f5e';
  const yFill = isAtRoot ? 'rgba(148,163,184,0.1)' : y >= 0
    ? 'rgba(20,184,166,0.15)'
    : 'rgba(244,63,94,0.12)';

  const svgW = RECT_MAX * RECT_SCALE + 80;
  const rx = 8;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs font-bold text-violet-700">y = area</div>
      <svg width={svgW} height={SVG_H} className="overflow-visible">
        {isAtRoot ? (
          <g>
            <line x1={rx} y1={BASE} x2={rx + Math.max(dispW, 3)} y2={BASE} stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" />
            <text x={rx + 10} y={BASE - 10} fontSize={10} fill="#64748b" fontWeight="600">area = 0 🎯</text>
          </g>
        ) : (
          <g>
            {/* Dashed guide: pure (x-r1)×(x-r2) rect without a — visible only when a≠1 */}
            {hasAScale && dispW > 2 && guideH > 2 && (
              <rect
                x={rx} y={BASE - guideH} width={dispW} height={guideH}
                fill="none" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 3" rx={3}
              />
            )}
            {/* Solid y = a·(x-r1)·(x-r2) rectangle */}
            <rect
              x={rx} y={BASE - dispH}
              width={Math.max(dispW, 2)} height={Math.max(dispH, 2)}
              fill={yFill} stroke={yCol} strokeWidth={2.5} rx={3}
              style={{ transition: 'all 0.25s ease' }}
            />
            {/* ×a badge above rect when a ≠ 1 */}
            {hasAScale && (
              <text x={rx + dispW / 2} y={BASE - Math.max(dispH, guideH) - 16}
                textAnchor="middle" fontSize={9} fill="#7c3aed" fontWeight="bold">
                ×{fmt(a)}
              </text>
            )}
            {/* Width label (x-r1) — bottom */}
            {dispW > 14 && (
              <text x={rx + dispW / 2} y={BASE + 14} textAnchor="middle" fontSize={9} fill={c1.text} fontWeight="700">
                {dimLabel(r1, Math.abs(f1))}
              </text>
            )}
            {/* Height label — right side; shows a·(x-r2) when a≠1 */}
            {dispH > 8 && (
              <text x={rx + dispW + 6} y={BASE - dispH / 2}
                fontSize={9} fill={c2.text} fontWeight="700" dominantBaseline="middle">
                {hasAScale
                  ? `${fmt(a)}·${factorStr(r2)}=${fmt(Math.abs(a * f2))}`
                  : dimLabel(r2, Math.abs(f2))}
              </text>
            )}
            {/* Guide label — only shown when there's enough gap to avoid overlap (≥22px separation) */}
            {hasAScale && guideH > 8 && Math.abs(guideH - dispH) > 22 && (
              <text x={rx + dispW + 6} y={BASE - guideH / 2}
                fontSize={8} fill="#94a3b8" dominantBaseline="middle">
                {dimLabel(r2, Math.abs(f2))}
              </text>
            )}
            {/* Area value inside — only when rect is big enough not to crowd right-side labels */}
            {dispW > 55 && dispH > 30 && (
              <text x={rx + dispW / 2} y={BASE - dispH / 2}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={10} fill={yCol} fontWeight="bold">
                {fmt(Math.abs(y))}
              </text>
            )}
            {/* Width tick lines */}
            <line x1={rx} y1={BASE + 5} x2={rx + dispW} y2={BASE + 5} stroke={c1.stroke} strokeWidth={1.5} />
            <line x1={rx} y1={BASE + 2} x2={rx} y2={BASE + 8} stroke={c1.stroke} strokeWidth={1.5} />
            <line x1={rx + dispW} y1={BASE + 2} x2={rx + dispW} y2={BASE + 8} stroke={c1.stroke} strokeWidth={1.5} />
            {/* Height tick lines */}
            <line x1={rx + dispW + 4} y1={BASE - dispH} x2={rx + dispW + 4} y2={BASE} stroke={c2.stroke} strokeWidth={1.5} />
            <line x1={rx + dispW + 1} y1={BASE - dispH} x2={rx + dispW + 7} y2={BASE - dispH} stroke={c2.stroke} strokeWidth={1.5} />
            <line x1={rx + dispW + 1} y1={BASE} x2={rx + dispW + 7} y2={BASE} stroke={c2.stroke} strokeWidth={1.5} />
          </g>
        )}
        <line x1={0} y1={BASE} x2={svgW} y2={BASE} stroke="#e2e8f0" strokeWidth={1} />
      </svg>
      <div className={`text-xs font-bold ${isAtRoot ? 'text-slate-400' : 'text-violet-700'}`}>
        {fmt(y)}
      </div>
      {!roots.double ? (
        <div className="text-xs text-slate-400">{factorStr(r1)}{factorStr(r2)}</div>
      ) : (
        <div className="text-xs text-slate-400">{factorStr(r1)}²</div>
      )}
    </div>
  );
}

// ─── y as a plain bar (when not factorisable) ─────────────────────────────
function YBar({ y }) {
  const h = clampU(Math.abs(y)) * SCALE;
  const col = COLORS.y;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`text-xs font-bold ${col.label}`}>y total</div>
      <svg width={50} height={SVG_H} className="overflow-visible">
        <rect
          x={10} y={y >= 0 ? BASE - h : BASE} width={30} height={h}
          fill={col.fill} stroke={col.stroke} strokeWidth={2} rx={3}
          style={{ transition: 'all 0.25s ease' }}
        />
        {h > 0
          ? <text x={25} y={y >= 0 ? BASE - h - 5 : BASE + h + 12} textAnchor="middle" fontSize={9} fill={col.text} fontWeight="600">{fmt(Math.abs(y))}</text>
          : <text x={25} y={BASE - 5} textAnchor="middle" fontSize={10} fill="#94a3b8">0</text>
        }
        <line x1={0} y1={BASE} x2={50} y2={BASE} stroke="#e2e8f0" strokeWidth={1} />
      </svg>
      <div className={`text-xs font-bold ${col.label}`}>{fmt(y)}</div>
      <div className="text-xs text-slate-400">= y</div>
    </div>
  );
}

// ─── Operator label ────────────────────────────────────────────────────────
function Op({ sign }) {
  return (
    <div className="flex items-end pb-8 text-slate-300 font-bold text-xl select-none">
      {sign}
    </div>
  );
}

// ─── Difference of squares geometric proof ────────────────────────────────
// Shows: big x² square with r² corner removed → L-shape rearranges into (x+r)(x-r) rectangle
function DifferenceOfSquaresViz({ a, c }) {
  const r = parseFloat(Math.sqrt(Math.abs(c) / a).toFixed(2));

  // Fixed symbolic proportions (not scaled to current selectedX)
  const S   = 14;    // px per symbolic unit
  const xu  = 6;     // "x" in diagram units
  const ru  = 2.2;   // "r" in diagram units (≈ ⅓ of x — looks clear)
  const xs  = xu * S;
  const rs  = ru * S;

  const rectW = (xu + ru) * S;   // (x+r) wide
  const rectH = (xu - ru) * S;   // (x-r) tall

  const padL = 22, padT = 20, padB = 30;
  const gap  = 44;
  const svgW = padL + xs + gap + rectW + 56;
  const svgH = padT + xs + padB;

  const Lx = padL, Ly = padT;
  const Rx = Lx + xs + gap;
  const Ry = padT + (xs - rectH) / 2;  // vertically centred next to L-shape

  const rLabel = a === 1 ? `√|c|` : `√(|c|÷a)`;

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wide text-center mb-2">
        🔷 Difference of Squares — why it factors geometrically
      </h3>

      {/* r explanation — connects r to the c value the user already sees */}
      <div className="mx-auto max-w-sm mb-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-relaxed text-slate-600">
        <span className={`font-bold ${COLORS.c.label}`}>c = −r²</span>
        {' '}so{' '}
        <span className={`font-bold ${COLORS.c.label}`}>r = {rLabel} = {r}</span>.{' '}
        r is the distance from zero to each root — the parabola crosses zero at x = +{r} and x = −{r}.
        {a !== 1 && <span className="text-slate-400"> (a={a} so we divide by it first)</span>}
      </div>

      <div className="flex justify-center overflow-x-auto">
        <svg width={svgW} height={svgH} className="overflow-visible">

          {/* ══ LEFT: full x² square (blue, same as x² tile above) with r² corner marked orange ══ */}

          {/* Full x² square — blue, matching the x² tile in the shape row above */}
          <rect x={Lx} y={Ly} width={xs} height={xs}
            fill={COLORS.a.fill} stroke={COLORS.a.stroke} strokeWidth={1.5} rx={2} />
          {/* x² label in the L-shape body (below and left of the corner) */}
          <text x={Lx + (xs-rs)/2} y={Ly + rs + (xs-rs)/2}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={11} fill={COLORS.a.text} fontWeight="700">x²</text>

          {/* r² corner — orange, same colour as the c bar above (because c = −r²) */}
          <rect x={Lx+xs-rs} y={Ly} width={rs} height={rs}
            fill={COLORS.c.fill} stroke={COLORS.c.stroke} strokeWidth={1.5} strokeDasharray="4 2" rx={2} />
          <text x={Lx+xs-rs/2} y={Ly+rs/2}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={8} fill={COLORS.c.text} fontWeight="700">r²=|c|</text>

          {/* Top dimension labels */}
          <text x={Lx+(xs-rs)/2} y={Ly-7} textAnchor="middle" fontSize={9} fill={COLORS.a.text} fontWeight="700">x−r</text>
          <text x={Lx+xs-rs/2}   y={Ly-7} textAnchor="middle" fontSize={9} fill={COLORS.c.text} fontWeight="700">r</text>
          {/* Left side label */}
          <text x={Lx-4} y={Ly+xs/2} textAnchor="end" dominantBaseline="middle" fontSize={9} fill={COLORS.a.text} fontWeight="700">x</text>

          {/* Formula below */}
          <text x={Lx+xs/2} y={Ly+xs+15} textAnchor="middle" fontSize={10} fill="#475569" fontWeight="600">x² − r²  (= x² + c)</text>

          {/* ══ ARROW ══ */}
          <text x={Lx+xs+gap/2} y={padT+xs/2-5}  textAnchor="middle" fontSize={20} fill="#94a3b8">⟶</text>
          <text x={Lx+xs+gap/2} y={padT+xs/2+11} textAnchor="middle" fontSize={7}  fill="#94a3b8">slide &</text>
          <text x={Lx+xs+gap/2} y={padT+xs/2+20} textAnchor="middle" fontSize={7}  fill="#94a3b8">rotate</text>

          {/* ══ RIGHT: (x+r) × (x−r) rectangle — teal/purple matching the factored rect above ══ */}

          {/* Left portion — teal f1 */}
          <rect x={Rx}    y={Ry} width={xs}    height={rectH} fill={COLORS.f1.fill} stroke="none" />
          {/* Right portion — purple f2 (the upper strip, rotated 90°) */}
          <rect x={Rx+xs} y={Ry} width={rs}    height={rectH} fill={COLORS.f2.fill} stroke="none" />
          {/* Border */}
          <rect x={Rx} y={Ry} width={rectW} height={rectH}
            fill="none" stroke={COLORS.f1.stroke} strokeWidth={2} rx={2} />
          {/* Dividing line */}
          <line x1={Rx+xs} y1={Ry} x2={Rx+xs} y2={Ry+rectH}
            stroke={COLORS.f1.stroke} strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />

          {/* Width label (x+r) — teal */}
          <text x={Rx+rectW/2} y={Ry-7}
            textAnchor="middle" fontSize={9} fill={COLORS.f1.text} fontWeight="700">x + r</text>
          {/* Height label (x−r) — teal */}
          <text x={Rx+rectW+5} y={Ry+rectH/2}
            textAnchor="start" dominantBaseline="middle" fontSize={9} fill={COLORS.f1.text} fontWeight="700">x − r</text>
          {/* Formula */}
          <text x={Rx+rectW/2} y={Ry+rectH+15}
            textAnchor="middle" fontSize={10} fill={COLORS.f1.text} fontWeight="700">(x+r)(x−r)</text>

        </svg>
      </div>

      <p className="text-xs text-slate-500 text-center mt-2 max-w-sm mx-auto leading-relaxed">
        The <span className={`font-bold ${COLORS.c.label}`}>orange r² corner</span> (= |c|) is replaced
        by sliding the strip across — giving a clean{' '}
        <span className={`font-bold ${COLORS.f1.label}`}>(x+r)</span>
        {' '}×{' '}
        <span className={`font-bold ${COLORS.f1.label}`}>(x−r)</span> rectangle
      </p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function ShapeVisualizer({ a, b, c, selectedX }) {
  const rootResult = computeRoots(a, b, c);
  const canFactor = rootResult.type === 'real' || rootResult.type === 'double';
  const roots = canFactor
    ? { r1: rootResult.r1, r2: rootResult.r2, double: rootResult.type === 'double' }
    : null;
  const y = a * selectedX * selectedX + b * selectedX + c;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Shape Visualizer
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          at x = <span className="font-mono font-semibold">{fmt(selectedX)}</span>
          {canFactor && (
            <span className="ml-2 text-teal-600 font-medium">
              · y shown as factored rectangle
            </span>
          )}
        </p>
      </div>

      {/* Main shapes row */}
      <div className="flex items-end gap-1 overflow-x-auto pb-2 justify-center flex-wrap">
        <SquareShape a={a} x={selectedX} />
        {b !== 0 && <><Op sign="+" /><LinearBar a={a} b={b} x={selectedX} /></>}
        {c !== 0 && <><Op sign="+" /><ConstantBar c={c} /></>}
        <Op sign="=" />
        {canFactor
          ? <FactoredRect a={a} x={selectedX} roots={roots} />
          : <YBar y={y} />
        }
      </div>

      {/* Color legend */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 justify-center text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-sm inline-block border ${COLORS.a.swatch}`} />
          <span className={COLORS.a.label}>x² → square</span>
        </span>
        {b !== 0 && (
          <span className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm inline-block border ${COLORS.b.swatch}`} />
            <span className={COLORS.b.label}>{b}x → rect (w={Math.abs(b)}, h=x)</span>
          </span>
        )}
        {c !== 0 && (
          <span className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm inline-block border ${COLORS.c.swatch}`} />
            <span className={COLORS.c.label}>{c} → constant</span>
          </span>
        )}
        {canFactor ? (
          <>
            <span className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm inline-block border ${COLORS.f1.swatch}`} />
              <span className={COLORS.f1.label}>width = (x−r₁)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm inline-block border ${COLORS.f2.swatch}`} />
              <span className={COLORS.f2.label}>height = (x−r₂)</span>
            </span>
          </>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm inline-block border ${COLORS.y.swatch}`} />
            <span className={COLORS.y.label}>y total</span>
          </span>
        )}
      </div>

      {/* Root hint */}
      {canFactor && (
        <div className="mt-3 text-center text-xs text-teal-600">
          🎯 Drag x to <strong>{fmt(roots.r1)}</strong>
          {!roots.double && <> or <strong>{fmt(roots.r2)}</strong></>} to see the rectangle collapse to zero
        </div>
      )}
      {!canFactor && (
        <div className="mt-3 text-center text-xs text-amber-500">
          No real roots — y shown as plain bar
        </div>
      )}

      {/* Difference-of-squares geometric proof — only shown for ax² − |c| (b=0, c<0, a>0) */}
      {b === 0 && c < 0 && a > 0 && <DifferenceOfSquaresViz a={a} c={c} />}
    </div>
  );
}
