import { useNavigate } from 'react-router-dom';
import { fetchStats } from '../services/api';
import { useRanking } from '../context/RankingContext';
import { exportRecommendationsCsv } from '../utils/export';
import { useState, useEffect } from 'react';

const scoreColors = {
  citizen_demand: 'bg-primary',
  demographic_need: 'bg-secondary',
  infrastructure_gap: 'bg-tertiary',
  feasibility: 'bg-primary-container',
  plan_alignment: 'bg-secondary-container',
};

const scoreLabels = {
  citizen_demand: 'Citizen Demand',
  demographic_need: 'Demographic Need',
  infrastructure_gap: 'Infrastructure Gap',
  feasibility: 'Feasibility',
  plan_alignment: 'Plan Alignment',
};

export default function DashboardPage() {
  const { recommendations } = useRanking();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats().then((st) => {
      setStats(st);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-on-surface-variant">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const openEvidence = (projectId) => {
    navigate(`/submissions?project=${projectId}`);
  };

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Submissions', value: stats?.total_today?.toLocaleString(), icon: 'inbox', trend: stats?.total_trend, color: 'primary' },
          { label: 'Unprocessed', value: stats?.unprocessed, icon: 'pending_actions', color: 'error' },
          { label: 'Active Clusters', value: '24', icon: 'hub', color: 'secondary' },
          { label: 'Ranked Projects', value: recommendations.length, icon: 'leaderboard', color: 'tertiary' },
        ].map((metric) => (
          <div key={metric.label} className="glass-panel p-5 rounded-xl inner-glow-top animate-fade-in-up">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-${metric.color}/10 flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-${metric.color}`}>{metric.icon}</span>
              </div>
              {metric.trend && (
                <span className="text-secondary text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  {metric.trend}
                </span>
              )}
            </div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{metric.label}</p>
            <p className={`text-3xl font-bold text-${metric.color} mt-1`}>{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-6 inner-glow-top">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Top Ranked Projects</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Transparent AI-driven scoring based on 5 weighted components · Click a project for evidence
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-gradient-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            onClick={() => exportRecommendationsCsv(recommendations)}
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <button
              type="button"
              key={rec.project_id}
              className="w-full text-left p-5 bg-white rounded-xl border border-black/5 hover:border-primary/30 transition-all group animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => openEvidence(rec.project_id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">
                      {rec.title}
                    </h3>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      {rec.evidence.submission_count} submissions · {rec.admin_unit_id} · Status: {rec.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{rec.final_score}</p>
                  <p className="text-[10px] text-on-surface-variant">Composite Score</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {Object.entries(rec.score_breakdown).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full ${scoreColors[key]} rounded-full transition-all duration-700`}
                        style={{ width: `${val.raw}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-on-surface-variant leading-tight">{scoreLabels[key]}</p>
                    <p className="text-xs font-bold text-on-surface">{val.weighted.toFixed(1)}</p>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
