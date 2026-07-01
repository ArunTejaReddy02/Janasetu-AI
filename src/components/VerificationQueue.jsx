export default function VerificationQueue({ items = [], onAction }) {
  return (
    <div className="glass-panel rounded-2xl p-[16px] inner-glow-top flex flex-col max-h-[45%]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="font-[Geist] text-sm font-bold flex items-center gap-2 text-on-surface">
            Verification Queue
            <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded-full">
              {items.length} Pending
            </span>
          </h3>
        </div>
        <button className="p-1.5 rounded hover:bg-black/5 text-on-surface-variant transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-sm">more_vert</span>
        </button>
      </div>

      {/* Queue Items */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="p-3 bg-white rounded-xl border border-black/5 hover:border-primary/40 transition-all cursor-pointer group shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Meta */}
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono text-tertiary">#{item.cluster_id}</span>
              <span className="text-[8px] text-on-surface-variant bg-black/5 px-1.5 py-0.5 rounded">
                {Math.round(item.confidence * 100)}% Confidence
              </span>
            </div>

            {/* Content */}
            <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
              {item.title}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-2">
              {item.description}
            </p>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              {item.actions.map((action, i) => (
                <button
                  key={action}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-all cursor-pointer ${
                    i === 0
                      ? 'bg-gradient-primary text-white'
                      : 'bg-surface-container-high hover:bg-surface-variant text-on-surface-variant'
                  }`}
                  onClick={() => onAction?.(item.id, action.toLowerCase())}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-2xl mb-2 block opacity-30">check_circle</span>
            All caught up — no items to verify.
          </div>
        )}
      </div>
    </div>
  );
}
