import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/': 'Dashboard Overview',
  '/submissions': 'Citizen Submissions',
  '/map': 'Demand Hotspot Map',
  '/projects': 'Ranked Projects',
  '/settings': 'Settings',
};

export default function Header({ onSearch, searchQuery = '' }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const title = pageTitles[location.pathname] || 'JanasetuAI';

  const [activeDropdown, setActiveDropdown] = useState(null); // 'notifications', 'help', 'apps', null
  const headerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownType) => {
    setActiveDropdown(prev => prev === dropdownType ? null : dropdownType);
  };

  return (
    <header ref={headerRef} className="fixed top-0 right-0 left-[72px] h-16 flex justify-between items-center px-[16px] z-40 bg-surface/85 backdrop-blur-xl border-b border-black/5">
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
            className="w-full bg-black/5 border border-transparent rounded-full pl-11 py-2 text-sm text-on-surface focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-on-surface-variant/50 outline-none"
            placeholder="Search reports by ID, location, or entity..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>

      {/* Right — Actions & Profile */}
      <div className="flex items-center gap-4 relative">
        <div className="flex items-center gap-1 mr-4">
          
          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('notifications')}
              className={`p-2 rounded-full text-on-surface-variant transition-all cursor-pointer relative ${activeDropdown === 'notifications' ? 'bg-primary/10 text-primary' : 'hover:bg-black/5'}`} 
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
            </button>
            
            {activeDropdown === 'notifications' && (
              <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-4 shadow-2xl z-50 animate-fade-in-up">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-black/5">
                  <span className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">Notifications</span>
                  <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="p-2.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-on-surface flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" /> Urgent Issue Reported
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">Water contamination near Anganwadi in Ward 12.</p>
                    <span className="text-[9px] text-on-surface-variant/60 mt-1 block">2 minutes ago</span>
                  </div>
                  <div className="p-2.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-on-surface flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Audio Translated
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">Grievance translated from Telugu to English by Bhashini.</p>
                    <span className="text-[9px] text-on-surface-variant/60 mt-1 block">15 minutes ago</span>
                  </div>
                  <div className="p-2.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-on-surface flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Hotspot Formed
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">New cluster of 6 issues detected near Bazaar road.</p>
                    <span className="text-[9px] text-on-surface-variant/60 mt-1 block">1 hour ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('help')}
              className={`p-2 rounded-full text-on-surface-variant transition-all cursor-pointer ${activeDropdown === 'help' ? 'bg-primary/10 text-primary' : 'hover:bg-black/5'}`} 
              title="Help & Support"
            >
              <span className="material-symbols-outlined text-[22px]">help</span>
            </button>

            {activeDropdown === 'help' && (
              <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-4 shadow-2xl z-50 animate-fade-in-up">
                <div className="mb-3 pb-2 border-b border-black/5">
                  <span className="font-bold text-xs uppercase tracking-wider text-on-surface-variant block">JanaSetu Support</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg">mail</span>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Email Assistance</p>
                      <p className="text-[11px] text-on-surface-variant select-all">support@janasetu.ai</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-lg">phone_in_talk</span>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Toll-Free Helpline</p>
                      <p className="text-[11px] text-on-surface-variant">1800-309-8800 (9 AM - 6 PM)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">description</span>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Platform Guides</p>
                      <a href="#" className="text-[11px] text-primary font-bold hover:underline">Download Officer Manual.pdf</a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Apps Button */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('apps')}
              className={`p-2 rounded-full text-on-surface-variant transition-all cursor-pointer ${activeDropdown === 'apps' ? 'bg-primary/10 text-primary' : 'hover:bg-black/5'}`} 
              title="Apps"
            >
              <span className="material-symbols-outlined text-[22px]">apps</span>
            </button>

            {activeDropdown === 'apps' && (
              <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-4 shadow-2xl z-50 animate-fade-in-up">
                <div className="mb-3 pb-2 border-b border-black/5">
                  <span className="font-bold text-xs uppercase tracking-wider text-on-surface-variant block">Explore Services</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/resident" 
                    onClick={() => setActiveDropdown(null)}
                    className="p-3 rounded-xl hover:bg-black/5 text-center flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-primary text-[24px]">home_work</span>
                    <span className="text-[10px] font-bold text-on-surface">Resident Portal</span>
                  </Link>
                  <a 
                    href="http://localhost:5555" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 rounded-xl hover:bg-black/5 text-center flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-secondary text-[24px]">database</span>
                    <span className="text-[10px] font-bold text-on-surface">Prisma Studio</span>
                  </a>
                  <div className="p-3 rounded-xl hover:bg-black/5 text-center flex flex-col items-center gap-1 opacity-50 cursor-not-allowed">
                    <span className="material-symbols-outlined text-on-surface-variant text-[24px]">insights</span>
                    <span className="text-[10px] font-bold text-on-surface">AI Analytics</span>
                  </div>
                  <div className="p-3 rounded-xl hover:bg-black/5 text-center flex flex-col items-center gap-1 opacity-50 cursor-not-allowed">
                    <span className="material-symbols-outlined text-on-surface-variant text-[24px]">translate</span>
                    <span className="text-[10px] font-bold text-on-surface">STT Hub</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* User profile & logout */}
        <div className="flex items-center gap-3 pl-4 border-l border-black/10">
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">{user?.name || 'Officer Sharma'}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
              {user?.role ? user.role.replace(/_/g, ' ') : 'Verified Agent'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-[22px]">person</span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-black/5 text-on-surface-variant hover:text-error transition-colors cursor-pointer ml-1"
            title="Log Out"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
