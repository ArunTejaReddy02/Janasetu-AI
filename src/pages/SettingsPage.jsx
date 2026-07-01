import { useState, useEffect } from 'react';
import { useRanking } from '../context/RankingContext';
import { DEFAULT_WEIGHTS, weightsSum } from '../utils/ranking';

const componentMeta = {
  citizen_demand: { label: 'Citizen Demand', desc: 'Submission volume, urgency, recency' },
  demographic_need: { label: 'Demographic Need', desc: 'Population affected, vulnerability' },
  infrastructure_gap: { label: 'Infrastructure Gap', desc: 'Distance/capacity deficit vs norms' },
  feasibility: { label: 'Feasibility', desc: 'Cost proxy, land/permit complexity' },
  plan_alignment: { label: 'Plan Alignment', desc: 'Match with development plan' },
};

export default function SettingsPage() {
  const { weights, saveWeights, normalizeAndSave } = useRanking();
  const [draft, setDraft] = useState(weights);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setDraft(weights);
  }, [weights]);

  const sum = weightsSum(draft);
  const sumValid = Math.abs(sum - 1.0) <= 0.001;

  const handleSlider = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value / 100 }));
    setMessage(null);
  };

  const handleSave = () => {
    const result = saveWeights(draft);
    if (result.ok) {
      setMessage({ type: 'success', text: 'Weights saved. Rankings updated across the dashboard.' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleNormalize = () => {
    const normalized = normalizeAndSave(draft);
    setDraft(normalized);
    setMessage({ type: 'success', text: 'Weights normalized to sum to 1.0 and saved.' });
  };

  const handleReset = () => {
    setDraft({ ...DEFAULT_WEIGHTS });
    saveWeights({ ...DEFAULT_WEIGHTS });
    setMessage({ type: 'success', text: 'Reset to PRD default weights.' });
  };

  return (
    <div className="h-full overflow-y-auto pr-2 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-on-surface">Ranking Weight Configuration</h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Adjust how each signal contributes to the composite score. Weights must sum to 1.0 (FR-8).
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 inner-glow-top space-y-6">
        {Object.entries(componentMeta).map(([key, meta]) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-bold text-on-surface">{meta.label}</p>
                <p className="text-[10px] text-on-surface-variant">{meta.desc}</p>
              </div>
              <span className="text-lg font-bold text-primary font-mono">
                {((draft[key] ?? 0) * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={Math.round((draft[key] ?? 0) * 100)}
              onChange={(e) => handleSlider(key, Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        ))}

        <div className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${sumValid ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
          <span className="material-symbols-outlined text-lg">{sumValid ? 'check_circle' : 'warning'}</span>
          Total: {(sum * 100).toFixed(0)}% {sumValid ? '— valid' : '— must equal 100%'}
        </div>

        {message && (
          <p className={`text-xs font-bold ${message.type === 'success' ? 'text-secondary' : 'text-error'}`}>
            {message.text}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!sumValid}
            className="px-4 py-2 bg-gradient-primary text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            Save Weights
          </button>
          <button
            type="button"
            onClick={handleNormalize}
            className="px-4 py-2 bg-white border border-black/10 rounded-lg text-xs font-bold cursor-pointer hover:bg-surface-container"
          >
            Normalize to 100%
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-black/5 rounded-lg text-xs font-bold text-on-surface-variant cursor-pointer hover:bg-black/10"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4 inner-glow-top mt-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
          Formula (PRD Section 11)
        </h3>
        <p className="text-xs font-mono text-on-surface-variant leading-relaxed">
          final_score = w₁×citizen_demand + w₂×demographic_need + w₃×infrastructure_gap + w₄×feasibility + w₅×plan_alignment
        </p>
      </div>
    </div>
  );
}
