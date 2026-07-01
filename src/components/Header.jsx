import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard Overview',
  '/submissions': 'Citizen Submissions',
  '/map': 'Demand Hotspot Map',
  '/projects': 'Ranked Projects',
  '/settings': 'Settings',
};

export default function Header({ onSearch, searchQuery = '' }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'JanasetuAI';

  return (
    <header className="fixed top-0 right-0 left-[72px] h-16 flex justify-between items-center px-[16px] z-40 bg-surface/80 backdrop-blur-md border-b border-black/5">
      {/* Left — Title & Search */}
      <div className="flex items-center gap-6">
        <h1 className="font-[Geist] text-[24px] leading-[32px] font-bold text-on-surface tracking-tight">
          {title}
        </h1>
        <div className="relative w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[18px] pointer-events-none">
            search
          </span>
          <input
            className="w-full bg-black/5 border-none rounded-full pl-11 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/50 outline-none"
            placeholder="Search reports by ID, location, or entity..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>

      {/* Right — Actions & Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 mr-4">
          <button className="p-2 rounded-full hover:bg-black/5 text-on-surface-variant transition-colors cursor-pointer" title="Notifications">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <button className="p-2 rounded-full hover:bg-black/5 text-on-surface-variant transition-colors cursor-pointer" title="Help">
            <span className="material-symbols-outlined text-[22px]">help</span>
          </button>
          <button className="p-2 rounded-full hover:bg-black/5 text-on-surface-variant transition-colors cursor-pointer" title="Apps">
            <span className="material-symbols-outlined text-[22px]">apps</span>
          </button>
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-black/10">
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">Officer Sharma</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Verified Agent</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-[22px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
