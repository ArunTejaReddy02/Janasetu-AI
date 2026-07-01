import { useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SubmissionCard from '../components/SubmissionCard';
import FilterPanel from '../components/FilterPanel';
import VerificationQueue from '../components/VerificationQueue';
import ClusterTimeline from '../components/ClusterTimeline';
import EvidenceGrid from '../components/EvidenceGrid';
import { useSubmissions } from '../hooks/useSubmissions';
import { useFilters } from '../hooks/useFilters';
import { useClusters } from '../hooks/useClusters';
import { getProjectById, getSubmissionsForProject } from '../services/api';
import { useRanking } from '../context/RankingContext';

export default function SubmissionsPage({ searchQuery = '' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { recommendations } = useRanking();

  const { submissions, stats, loading } = useSubmissions();
  const { filters, setFilter, toggleChannel, clearFilters, filteredSubmissions } = useFilters(submissions);
  const { verificationQueue, activeProjects, handleVerificationAction } = useClusters();

  useEffect(() => {
    if (searchQuery) setFilter('search', searchQuery);
  }, [searchQuery, setFilter]);

  const project = projectId ? getProjectById(projectId) ?? recommendations.find((r) => r.project_id === projectId) : null;
  const projectSubmissions = projectId ? getSubmissionsForProject(projectId) : null;

  const displaySubmissions = useMemo(() => {
    const base = projectSubmissions ?? filteredSubmissions;
    if (!filters.search && !searchQuery) return base;
    const query = (filters.search || searchQuery).toLowerCase();
    return base.filter((sub) => {
      const searchable = [
        sub.submission_id,
        sub.extracted.summary,
        sub.extracted.location_text,
        sub.raw_content.transcript,
        sub.extracted.facility_type,
      ].join(' ').toLowerCase();
      return searchable.includes(query);
    });
  }, [projectSubmissions, filteredSubmissions, filters.search, searchQuery]);

  const clearProjectFilter = () => {
    searchParams.delete('project');
    setSearchParams(searchParams);
  };

  return (
    <>
      <div className="h-full grid grid-cols-12 gap-[12px] relative z-10 overflow-hidden">
        <FilterPanel
          filters={filters}
          setFilter={setFilter}
          toggleChannel={toggleChannel}
          clearFilters={clearFilters}
          stats={stats}
        />

        <section className="col-span-6 flex flex-col h-full min-h-0">
          {project && (
            <div className="mb-4 p-4 glass-panel rounded-xl inner-glow-top border border-primary/20 animate-fade-in-up">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Evidence Drill-down</p>
                  <h2 className="text-lg font-bold text-on-surface">{project.title}</h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {project.evidence.submission_count} linked submissions · Score {project.final_score} · {project.admin_unit_id}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs text-primary font-bold shrink-0 cursor-pointer hover:underline"
                  onClick={clearProjectFilter}
                >
                  Clear filter
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <Link to={`/projects`} className="text-[10px] text-on-surface-variant hover:text-primary font-bold">
                  ← Back to Projects
                </Link>
                <Link to={`/map?ward=${project.admin_unit_id}`} className="text-[10px] text-on-surface-variant hover:text-primary font-bold">
                  View on Map
                </Link>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">sensors</span>
              </div>
              <div>
                <h2 className="text-[24px] font-bold tracking-tight text-on-surface leading-[32px]">
                  {project ? 'Linked Submissions' : 'Active Submissions'}
                </h2>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  {project
                    ? `${displaySubmissions.length} evidence records for this project`
                    : `Live streaming data from ${stats?.channels_active ?? '...'} channels`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-sm">Loading submissions...</p>
              </div>
            ) : displaySubmissions.length > 0 ? (
              displaySubmissions.map((sub) => (
                <SubmissionCard key={sub.submission_id} submission={sub} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-30">filter_list_off</span>
                <p className="text-sm font-bold">No submissions match your filters</p>
              </div>
            )}
          </div>
        </section>

        <aside className="col-span-3 flex flex-col gap-[12px] h-full min-h-0 overflow-y-auto pb-4">
          <VerificationQueue items={verificationQueue} onAction={handleVerificationAction} />
          <ClusterTimeline projects={activeProjects} />
          <EvidenceGrid submissionIds={project?.evidence?.sample_submission_ids} />
        </aside>
      </div>
    </>
  );
}
