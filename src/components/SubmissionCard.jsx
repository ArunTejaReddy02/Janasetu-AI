const channelConfig = {
  whatsapp: { icon: 'chat', color: 'text-green-600', label: 'WhatsApp' },
  web: { icon: 'public', color: 'text-blue-600', label: 'Web Portal' },
  voice: { icon: 'call', color: 'text-orange-600', label: 'Voice (Transcribed)' },
};

const languageLabels = {
  hi: 'Hindi',
  en: 'English',
  mr: 'Marathi',
  kn: 'Kannada',
  te: 'Telugu',
};

const facilityIcons = {
  water_infrastructure: 'apartment',
  lighting: 'lightbulb',
  sanitation: 'delete',
  roads: 'road',
  drainage: 'water_drop',
  education: 'school',
  health: 'local_hospital',
};

export default function SubmissionCard({ submission }) {
  const {
    submission_id,
    channel,
    raw_content,
    extracted,
    time_ago,
    status,
  } = submission;

  const chConfig = channelConfig[channel] || channelConfig.web;
  const isHighUrgency = extracted.urgency === 'high';
  const lang = languageLabels[raw_content.detected_language] || raw_content.detected_language;
  const facilityIcon = facilityIcons[extracted.facility_type] || 'category';

  // Capitalize facility type for display
  const facilityLabel = extracted.facility_type
    ? extracted.facility_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Unknown';

  return (
    <div
      className={`glass-panel p-5 rounded-2xl inner-glow-top relative overflow-hidden group animate-fade-in-up ${
        isHighUrgency
          ? 'urgency-high'
          : 'urgency-low opacity-90 hover:opacity-100'
      } transition-all`}
    >
      {/* Top-right badges */}
      <div className="absolute top-0 right-0 p-3 flex gap-2">
        {isHighUrgency && (
          <span className="px-2 py-1 bg-error text-on-error rounded text-[10px] font-bold tracking-widest">
            CRITICAL
          </span>
        )}
        <span className="px-2 py-1 bg-black/5 text-on-surface text-[10px] rounded font-mono">
          #{submission_id}
        </span>
      </div>

      <div className="flex gap-4">
        {/* Channel Icon */}
        <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center shrink-0 border border-black/5">
          <span
            className={`material-symbols-outlined ${chConfig.color} text-2xl`}
            style={channel === 'whatsapp' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {chConfig.icon}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Metadata */}
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-xs text-on-surface-variant">schedule</span>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              {status === 'processed' ? 'Processed' : 'Received'} {time_ago} via {chConfig.label}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-lg font-bold text-on-surface mb-2">{extracted.summary}</h4>

          {/* Transcript */}
          <div className="bg-black/5 p-3 rounded-lg border border-black/5 mb-4 font-[Geist] text-sm italic text-on-surface-variant leading-relaxed">
            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mr-2 not-italic">
              {lang} Detected
            </span>
            &ldquo;{raw_content.transcript}&rdquo;
          </div>

          {/* Entity Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="px-3 py-1 bg-black/5 border border-black/10 rounded-full flex items-center gap-2">
              <span className="material-symbols-outlined text-xs text-secondary">{facilityIcon}</span>
              <span className="text-xs font-mono text-on-surface-variant">
                Facility: {facilityLabel}
              </span>
            </div>
            <div className="px-3 py-1 bg-black/5 border border-black/10 rounded-full flex items-center gap-2">
              <span className="material-symbols-outlined text-xs text-primary">location_on</span>
              <span className="text-xs font-mono text-on-surface-variant">
                Location: {extracted.location_text}
              </span>
            </div>
            {isHighUrgency && (
              <div className="px-3 py-1 bg-black/5 border border-black/10 rounded-full flex items-center gap-2">
                <span className="material-symbols-outlined text-xs text-tertiary">priority_high</span>
                <span className="text-xs font-mono text-on-surface-variant">Urgency: High</span>
              </div>
            )}
          </div>

          {/* Footer — Cluster & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-black/5">
            <div className="flex items-center gap-2">
              {extracted.cluster_id ? (
                <span className="px-2 py-1 bg-tertiary/20 text-tertiary text-[10px] font-bold rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">hub</span>
                  CLUSTER: {extracted.cluster_id}
                </span>
              ) : (
                <span className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">auto_fix_high</span>
                  PROCESSED BY SETU-AI
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {isHighUrgency ? (
                <>
                  <button className="p-2 hover:bg-black/5 text-on-surface-variant transition-all rounded-lg cursor-pointer">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                  <button className="px-4 py-1.5 bg-gradient-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer">
                    Take Action
                  </button>
                </>
              ) : (
                <button className="px-4 py-1.5 bg-surface-container-high hover:bg-surface-variant text-on-surface rounded-lg text-xs font-bold transition-all cursor-pointer">
                  Queue Task
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
