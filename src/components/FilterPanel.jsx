const languageOptions = [
  { value: 'all', label: 'All' },
  { value: 'te', label: 'Telugu' },
  { value: 'hi', label: 'Hindi' },
  { value: 'mr', label: 'Marathi' },
  { value: 'kn', label: 'Kannada' },
];

const channelOptions = [
  { value: 'whatsapp', icon: 'chat', color: 'text-green-600', label: 'WhatsApp' },
  { value: 'web', icon: 'public', color: 'text-blue-600', label: 'Web Portal' },
  { value: 'voice', icon: 'call', color: 'text-orange-600', label: 'Voice Intake' },
];

export default function FilterPanel({ filters, setFilter, toggleChannel, clearFilters, stats }) {
  return (
    <aside className="col-span-3 flex flex-col gap-[12px] h-full min-h-0 overflow-y-auto pr-1 pb-4">
      {/* Real-time Stats */}
      <div className="glass-panel p-[16px] rounded-xl inner-glow-top">
        <h3 className="font-mono text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant mb-4 flex items-center justify-between uppercase">
          Real-Time Stats
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        </h3>
        <div className="space-y-4">
          {/* Total Today */}
          <div className="flex justify-between items-end border-b border-black/5 pb-2">
            <div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Total Today</p>
              <p className="text-3xl font-[Geist] font-bold text-primary">
                {stats?.total_today?.toLocaleString() ?? '—'}
              </p>
            </div>
            <span className="text-secondary text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              {stats?.total_trend ?? ''}
            </span>
          </div>

          {/* Unprocessed */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Unprocessed</p>
              <p className="text-3xl font-[Geist] font-bold text-error">
                {stats?.unprocessed ?? '—'}
              </p>
            </div>
            <div className="w-16 h-8 flex items-end gap-1">
              <div className="w-2 bg-error/20 h-[40%] rounded-t-sm" />
              <div className="w-2 bg-error/40 h-[60%] rounded-t-sm" />
              <div className="w-2 bg-error/60 h-[90%] rounded-t-sm" />
              <div className="w-2 bg-error h-[70%] rounded-t-sm" />
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="mt-6 pt-6 border-t border-black/5">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-4">
            Language Distribution
          </p>
          <div className="relative w-full aspect-square flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                className="text-primary/10"
                cx="64" cy="64" r="50"
                fill="transparent" stroke="currentColor" strokeWidth="12"
              />
              <circle
                className="text-primary"
                cx="64" cy="64" r="50"
                fill="transparent" stroke="currentColor"
                strokeWidth="12" strokeDasharray="314" strokeDashoffset="100"
              />
              <circle
                className="text-secondary"
                cx="64" cy="64" r="50"
                fill="transparent" stroke="currentColor"
                strokeWidth="12" strokeDasharray="314" strokeDashoffset="250"
              />
              <circle
                className="text-tertiary"
                cx="64" cy="64" r="50"
                fill="transparent" stroke="currentColor"
                strokeWidth="12" strokeDasharray="314" strokeDashoffset="290"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-on-surface">Local</span>
              <span className="text-[10px] text-on-surface-variant">Top-3</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {stats?.languages &&
              Object.entries(stats.languages).map(([lang, pct]) => {
                const colorMap = { Hindi: 'bg-primary', Marathi: 'bg-secondary', Telugu: 'bg-primary-container', English: 'bg-tertiary' };
                return (
                  <div key={lang} className="flex items-center gap-2 text-[10px] text-on-surface">
                    <span className={`w-2 h-2 rounded-full ${colorMap[lang] || 'bg-outline'}`} />
                    {lang} ({pct}%)
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-[16px] rounded-xl inner-glow-top flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-[Geist] text-sm font-bold text-on-surface">Quick Filters</h3>
          <button
            className="text-[10px] text-primary uppercase font-bold tracking-widest hover:underline cursor-pointer"
            onClick={clearFilters}
          >
            Clear
          </button>
        </div>

        <div className="space-y-6">
          {/* Language Filter */}
          <div>
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest block mb-3">
              Language
            </label>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    filters.language === opt.value
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-black/5 text-on-surface-variant hover:bg-black/10'
                  }`}
                  onClick={() => setFilter('language', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Filter */}
          <div>
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest block mb-3">
              Channel
            </label>
            <div className="space-y-2">
              {channelOptions.map((ch) => (
                <label
                  key={ch.value}
                  className="flex items-center justify-between p-2 rounded-lg bg-black/5 hover:bg-black/10 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${ch.color} text-lg`}>{ch.icon}</span>
                    <span className="text-xs text-on-surface">{ch.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.channels.includes(ch.value)}
                    onChange={() => toggleChannel(ch.value)}
                    className="rounded border-none bg-primary/20 text-primary focus:ring-0 focus:ring-offset-0"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest block mb-3">
              Urgency Tier
            </label>
            <div className="flex gap-2">
              <button
                className={`flex-1 py-3 rounded-lg border flex flex-col items-center justify-center gap-1 group transition-all cursor-pointer ${
                  filters.urgency === 'high'
                    ? 'border-error/50 bg-error/20 text-error'
                    : 'border-error/30 bg-error/10 text-error hover:bg-error/20'
                }`}
                onClick={() => setFilter('urgency', filters.urgency === 'high' ? 'all' : 'high')}
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">priority_high</span>
                <span className="text-[10px] font-bold">HIGH</span>
              </button>
              <button
                className={`flex-1 py-3 rounded-lg border flex flex-col items-center justify-center gap-1 group transition-all cursor-pointer ${
                  filters.urgency === 'normal'
                    ? 'border-primary/50 bg-primary/20 text-primary'
                    : 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
                }`}
                onClick={() => setFilter('urgency', filters.urgency === 'normal' ? 'all' : 'normal')}
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">low_priority</span>
                <span className="text-[10px] font-bold">NORMAL</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
