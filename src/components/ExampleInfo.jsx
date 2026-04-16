// Info card shown when a guided example is selected

export default function ExampleInfo({ example }) {
  if (!example) return null;

  return (
    <div className="bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 rounded-2xl p-5 flex gap-4 items-start">
      <div className="text-4xl">{example.emoji}</div>
      <div>
        <div className="font-bold text-violet-700 text-base mb-1">
          {example.name}: y = {example.equation}
        </div>
        <p className="text-sm text-slate-600 mb-2">{example.description}</p>
        <div className="bg-white/70 border border-violet-100 rounded-lg px-3 py-2 text-xs text-violet-800">
          💡 <strong>Fun fact:</strong> {example.fact}
        </div>
      </div>
    </div>
  );
}
