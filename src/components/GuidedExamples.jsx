// Pre-set guided examples to explore

const EXAMPLES = [
  {
    id: 1,
    name: 'Simple Square',
    equation: 'x²',
    a: 1, b: 0, c: 0,
    emoji: '🟦',
    description: 'The simplest quadratic! Just x squared. The square gets bigger the further you go from zero.',
    fact: 'x² is always positive (or zero), because a negative times a negative is positive!',
  },
  {
    id: 2,
    name: 'Moved Up',
    equation: 'x² + 3',
    a: 1, b: 0, c: 3,
    emoji: '⬆️',
    description: 'Adding a constant just lifts the whole curve up. The shape stays exactly the same!',
    fact: 'The constant "c" shifts the parabola up or down without changing its shape.',
  },
  {
    id: 3,
    name: 'Upside Down',
    equation: '−x²',
    a: -1, b: 0, c: 0,
    emoji: '🙃',
    description: 'Making "a" negative flips the whole parabola upside down. Like an arch!',
    fact: 'Negative "a" means the parabola opens downward — it has a maximum instead of a minimum.',
  },
  {
    id: 4,
    name: 'With a Line',
    equation: 'x² + 2x',
    a: 1, b: 2, c: 0,
    emoji: '↗️',
    description: 'Adding a "bx" term (the line piece) shifts the bottom of the curve sideways.',
    fact: 'The "b" term shifts the vertex left or right and also up or down!',
  },
  {
    id: 5,
    name: 'Full Equation',
    equation: 'x² − 4x + 3',
    a: 1, b: -4, c: 3,
    emoji: '🎯',
    description: 'A classic! This one crosses the x-axis at x=1 and x=3. Those are called the "roots".',
    fact: 'Where the parabola crosses y=0 are called the roots or solutions of the equation.',
  },
  {
    id: 6,
    name: 'Wide Parabola',
    equation: '0.5x²',
    a: 0.5, b: 0, c: 0,
    emoji: '🌈',
    description: 'A smaller "a" makes the parabola wider. A bigger "a" makes it narrower!',
    fact: 'The coefficient "a" controls how fast the square grows — think of it as "stretching" the parabola.',
  },
  {
    id: 7,
    name: 'Diff. of Squares',
    equation: 'x² − 4',
    a: 1, b: 0, c: -4,
    emoji: '🔷',
    description: 'A special pattern — x² minus a square number. See the geometric proof in the Shape Visualizer!',
    fact: 'x² − 4 = (x−2)(x+2): just take the square root of 4 (=2) and you instantly have both factors.',
  },
];

export default function GuidedExamples({ onSelect, currentA, currentB, currentC }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-500 mb-1 uppercase tracking-wide text-sm">
        Guided Examples
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        Click an example to explore it
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {EXAMPLES.map((ex) => {
          const isActive = ex.a === currentA && ex.b === currentB && ex.c === currentC;
          return (
            <button
              key={ex.id}
              onClick={() => onSelect(ex.a, ex.b, ex.c, ex)}
              className={`
                text-left p-3 rounded-xl border-2 transition-all duration-200
                ${isActive
                  ? 'border-violet-400 bg-violet-50'
                  : 'border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/50'
                }
              `}
            >
              <div className="text-xl mb-1">{ex.emoji}</div>
              <div className="font-bold text-slate-700 text-sm">{ex.name}</div>
              <div className="text-violet-600 font-mono text-xs mt-0.5">y = {ex.equation}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
