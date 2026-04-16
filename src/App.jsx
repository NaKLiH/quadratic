import { useState } from 'react';
import EquationDisplay from './components/EquationDisplay';
import ShapeVisualizer from './components/ShapeVisualizer';
import ParabolaGraph from './components/ParabolaGraph';
import InteractiveControls from './components/InteractiveControls';
import GuidedExamples from './components/GuidedExamples';
import ExampleInfo from './components/ExampleInfo';
import FactorisationVisualizer from './components/FactorisationVisualizer';
import './index.css';

export default function App() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [selectedX, setSelectedX] = useState(2);
  const [activeExample, setActiveExample] = useState(null);

  const handleSelectExample = (ea, eb, ec, example) => {
    setA(ea);
    setB(eb);
    setC(ec);
    setActiveExample(example);
  };

  const handleChangeA = (val) => { setA(val); setActiveExample(null); };
  const handleChangeB = (val) => { setB(val); setActiveExample(null); };
  const handleChangeC = (val) => { setC(val); setActiveExample(null); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800">
            📐 Quadratic Equations Explorer
          </h1>
          <p className="text-slate-500 mt-1 text-base">
            See how <span className="text-blue-600 font-semibold">squares</span>,{' '}
            <span className="text-emerald-600 font-semibold">lines</span>, and{' '}
            <span className="text-orange-500 font-semibold">constants</span> combine to make a parabola
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Equation controls — at the top so the equation is always visible */}
        <InteractiveControls
          a={a} b={b} c={c}
          onChangeA={handleChangeA}
          onChangeB={handleChangeB}
          onChangeC={handleChangeC}
        />

        {/* Intro Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h2 className="text-blue-800 font-bold text-base mb-2">🎓 What is a Quadratic Equation?</h2>
          <p className="text-blue-700 text-sm leading-relaxed">
            A quadratic equation looks like <strong>y = ax² + bx + c</strong>. It always makes a U-shaped
            curve called a <strong>parabola</strong>. The cool part? You can see <em>why</em> it curves by
            watching what each piece does! The <strong>x² part</strong> acts like a square (its area
            grows fast!), the <strong>bx part</strong> acts like a line (grows steadily), and{' '}
            <strong>c</strong> just shifts everything up or down. Move the slider below the graph to
            explore any point!
          </p>
        </div>

        {/* Active example info */}
        {activeExample && <ExampleInfo example={activeExample} />}

        {/* Main layout: Graph + Shapes side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParabolaGraph
            a={a} b={b} c={c}
            selectedX={selectedX}
            onSelectX={setSelectedX}
          />
          <div className="flex flex-col gap-6">
            <ShapeVisualizer a={a} b={b} c={c} selectedX={selectedX} />
            <EquationDisplay a={a} b={b} c={c} selectedX={selectedX} />
          </div>
        </div>

        {/* Factorisation section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FactorisationVisualizer a={a} b={b} c={c} selectedX={selectedX} />
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex flex-col justify-center">
            <h2 className="text-teal-800 font-bold text-base mb-2">🔄 What is Factorisation?</h2>
            <p className="text-teal-700 text-sm leading-relaxed mb-3">
              Factorisation means rewriting the equation as <strong>two brackets multiplied together</strong>:
            </p>
            <div className="bg-white/70 rounded-xl p-3 font-mono text-center text-base font-bold text-teal-800 mb-3">
              ax² + bx + c = a(x − r₁)(x − r₂)
            </div>
            <p className="text-teal-700 text-sm leading-relaxed mb-2">
              Those two brackets are like the <strong>width</strong> and <strong>height</strong> of a rectangle.
              Their product (the area) equals <strong>y</strong>.
            </p>
            <p className="text-teal-700 text-sm leading-relaxed">
              🎯 The <strong>roots</strong> (r₁ and r₂) are the x-values where the parabola
              crosses zero — one side of the rectangle becomes 0, so the area collapses to 0!
              Drag x to a root to see it happen.
            </p>
          </div>
        </div>

        {/* X slider */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-violet-700">
              🔍 Explore at x = <span className="font-mono text-base">{parseFloat(selectedX.toFixed(1))}</span>
            </label>
            <span className="text-xs text-slate-400">Drag to move along the graph</span>
          </div>
          <input
            type="range"
            min={-10}
            max={10}
            step={0.1}
            value={selectedX}
            onChange={(e) => setSelectedX(parseFloat(e.target.value))}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: '#7c3aed' }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>x = −10</span>
            <span>x = 0</span>
            <span>x = 10</span>
          </div>
        </div>

        {/* Guided examples — full width at the bottom */}
        <GuidedExamples
          onSelect={handleSelectExample}
          currentA={a} currentB={b} currentC={c}
        />

      </main>

      <footer className="text-center text-xs text-slate-400 py-6">
        Built for curious 12-year-olds (and older!) 🚀
      </footer>
    </div>
  );
}

