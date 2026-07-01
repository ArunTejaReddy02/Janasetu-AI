import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { DEFAULT_WEIGHTS, applyWeights, normalizeWeights, weightsSum } from '../utils/ranking';
import { fetchRecommendationsBase } from '../services/api';

const STORAGE_KEY = 'setuai-ranking-weights';

const RankingContext = createContext(null);

function loadWeights() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_WEIGHTS, ...JSON.parse(stored) };
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_WEIGHTS };
}

export function RankingProvider({ children }) {
  const [baseRecommendations, setBaseRecommendations] = useState([]);
  const [weights, setWeightsState] = useState(loadWeights);
  const [projectStatuses, setProjectStatuses] = useState({});

  useEffect(() => {
    fetchRecommendationsBase().then(setBaseRecommendations);
  }, []);

  const setWeights = useCallback((next) => {
    setWeightsState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const saveWeights = useCallback((draft) => {
    const sum = weightsSum(draft);
    if (Math.abs(sum - 1.0) > 0.001) {
      return { ok: false, error: `Weights must sum to 1.0 (currently ${sum.toFixed(2)}). Use Normalize to fix.` };
    }
    setWeights(draft);
    return { ok: true };
  }, [setWeights]);

  const normalizeAndSave = useCallback((draft) => {
    const normalized = normalizeWeights(draft);
    setWeights(normalized);
    return normalized;
  }, [setWeights]);

  const recommendations = useMemo(() => {
    const ranked = applyWeights(baseRecommendations, weights);
    return ranked.map((rec) => ({
      ...rec,
      status: projectStatuses[rec.project_id] ?? rec.status,
    }));
  }, [baseRecommendations, weights, projectStatuses]);

  const updateProjectStatus = useCallback((projectId, status) => {
    setProjectStatuses((prev) => ({ ...prev, [projectId]: status }));
  }, []);

  const value = useMemo(
    () => ({
      weights,
      setWeights,
      saveWeights,
      normalizeAndSave,
      recommendations,
      updateProjectStatus,
    }),
    [weights, setWeights, saveWeights, normalizeAndSave, recommendations, updateProjectStatus]
  );

  return <RankingContext.Provider value={value}>{children}</RankingContext.Provider>;
}

export function useRanking() {
  const ctx = useContext(RankingContext);
  if (!ctx) throw new Error('useRanking must be used within RankingProvider');
  return ctx;
}

export default RankingContext;
