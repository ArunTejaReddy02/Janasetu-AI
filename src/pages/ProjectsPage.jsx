import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRanking } from '../context/RankingContext';
import { exportRecommendationsCsv, exportRecommendationsPdf } from '../utils/export';

const statusConfig = {
  new: { label: 'New', color: 'bg-secondary/20 text-secondary' },
  under_review: { label: 'Under Review', color: 'bg-primary/20 text-primary' },
  in_progress: { label: 'In Progress', color: 'bg-tertiary/20 text-tertiary' },
  funded: { label: 'Funded', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', color: 'bg-surface-container text-on-surface-variant' },
};

const componentLabels = {
  citizen_demand: { label: 'Citizen Demand', icon: 'groups', desc: 'Submission volume, urgency, recency' },
  demographic_need: { label: 'Demographic Need', icon: 'diversity_3', desc: 'Population affected, vulnerability' },
  infrastructure_gap: { label: 'Infrastructure Gap', icon: 'construction', desc: 'Distance/capacity deficit vs norms' },
  feasibility: { label: 'Feasibility', icon: 'engineering', desc: 'Cost proxy, land/permit complexity' },
  plan_alignment: { label: 'Plan Alignment', icon: 'assignment_turned_in', desc: 'Match with development plan' },
};

export default function ProjectsPage() {
  const { recommendations, weights, updateProjectStatus } = useRanking();
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const viewEvidence = (projectId) => {
    navigate(`/submissions?project=${projectId}`);
  };

  const viewOnMap = (adminUnitId) => {
    navigate(`/map?ward=${encodeURIComponent(adminUnitId)}`);
  };

  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Ranked Development Projects</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            {recommendations.length} projects ranked by transparent AI scoring · Weights configurable in Settings
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/settings"
            className="px-4 py-2 bg-white hover:bg-surface-container rounded-lg text-xs font-bold transition-all border border-black/5 text-on-surface flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Adjust Weights
          </Link>
          <button
            type="button"
            className="px-4 py-2 bg-white hover:bg-surface-container rounded-lg text-xs font-bold transition-all border border-black/5 text-on-surface flex items-center gap-2 shadow-sm cursor-pointer"
            onClick={() => exportRecommendationsCsv(recommendations)}
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gradient-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            onClick={() => exportRecommendationsPdf(recommendations, weights)}
          >
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            Export PDF
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4 inner-glow-top mb-6">
        <h3 className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-3">
          Current Weight Configuration
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(componentLabels).map(([key, val]) => (
            <div key={key} className="text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-primary text-lg">{val.icon}</span>
              </div>
              <p className="text-[10px] font-bold text-on-surface">{((weights[key] ?? 0) * 100).toFixed(0)}%</p>
              <p className="text-[9px] text-on-surface-variant leading-tight">{val.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((project, index) => {
          const isExpanded = expandedId === project.project_id;
          const status = statusConfig[project.status] || statusConfig.new;

          return (
            <div
              key={project.project_id}
              className="glass-panel rounded-2xl inner-glow-top overflow-hidden animate-fade-in-up transition-all"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className="p-5 cursor-pointer hover:bg-black/[0.02] transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : project.project_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-primary/20">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-on-surface text-lg">{project.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">description</span>
                          {project.evidence.submission_count} submissions
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          {project.admin_unit_id}
                        </span>
                        <span className="font-mono">{project.project_id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">{project.final_score}</p>
                      <p className="text-[10px] text-on-surface-variant">/ 100</p>
                    </div>
                    <span
                      className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex h-2 rounded-full overflow-hidden bg-black/5">
                  {Object.entries(project.score_breakdown).map(([key, val]) => (
                    <div
                      key={key}
                      className={`h-full transition-all duration-700 ${
                        key === 'citizen_demand' ? 'bg-primary' :
                        key === 'demographic_need' ? 'bg-secondary' :
                        key === 'infrastructure_gap' ? 'bg-tertiary' :
                        key === 'feasibility' ? 'bg-primary-container' :
                        'bg-secondary-container'
                      }`}
                      style={{ width: `${(val.weighted / project.final_score) * 100}%` }}
                      title={`${componentLabels[key]?.label}: ${val.weighted.toFixed(1)}`}
                    />
                  ))}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-black/5 pt-4 animate-fade-in-up">
                  <h4 className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-4">
                    Score Breakdown
                  </h4>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(project.score_breakdown).map(([key, val]) => {
                      const meta = componentLabels[key];
                      return (
                        <div key={key} className="bg-black/[0.03] rounded-xl p-3 text-center">
                          <div className="w-8 h-8 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-primary text-sm">{meta?.icon}</span>
                          </div>
                          <p className="text-[10px] font-bold text-on-surface mb-0.5">{meta?.label}</p>
                          <p className="text-[9px] text-on-surface-variant mb-2">{meta?.desc}</p>
                          <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${val.raw}%` }} />
                          </div>
                          <div className="flex justify-between text-[9px]">
                            <span className="text-on-surface-variant">Raw: {val.raw}</span>
                            <span className="font-bold text-primary">×{val.weight} = {val.weighted.toFixed(1)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-lg text-xs text-on-surface-variant transition-colors cursor-pointer flex items-center gap-1"
                        onClick={() => viewEvidence(project.project_id)}
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        View Submissions ({project.evidence.submission_count})
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-lg text-xs text-on-surface-variant transition-colors cursor-pointer flex items-center gap-1"
                        onClick={() => viewOnMap(project.admin_unit_id)}
                      >
                        <span className="material-symbols-outlined text-sm">map</span>
                        Show on Map
                      </button>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gradient-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-1"
                      onClick={() => updateProjectStatus(project.project_id, 'under_review')}
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Mark Under Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
