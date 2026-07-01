const colorMap = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
};

const dotColorMap = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
};

export default function ClusterTimeline({ projects = [] }) {
  return (
    <div className="glass-panel rounded-2xl p-[16px] inner-glow-top flex flex-col shrink-0">
      <h3 className="font-[Geist] text-sm font-bold mb-4 flex items-center gap-2 text-on-surface">
        Active Projects
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
      </h3>

      <div className="space-y-4">
        <div className="relative pl-4 border-l border-black/10 space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              {/* Timeline dot */}
              <div
                className={`absolute -left-[1.35rem] top-1 w-2.5 h-2.5 rounded-full ${
                  dotColorMap[project.color] || 'bg-primary'
                } ring-4 ring-background`}
              />

              {/* Project info */}
              <h4 className="text-xs font-bold text-on-surface">{project.title}</h4>
              <p className="text-[10px] text-on-surface-variant mb-2">
                {project.report_count} associated reports
              </p>

              {/* Progress bar */}
              <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colorMap[project.color] || 'bg-primary'} transition-all duration-500`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <p className="text-[10px] text-on-surface-variant">No active projects.</p>
          )}
        </div>
      </div>
    </div>
  );
}
