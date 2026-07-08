import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Overview' },
  { to: '/map', icon: 'map', label: 'Map' },
  { to: '/projects', icon: 'assignment', label: 'Projects' },
  { to: '/submissions', icon: 'fact_check', label: 'Submissions' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav
      className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-r border-black/5 flex flex-col py-[16px] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] overflow-hidden ${
        isHovered ? 'w-[240px]' : 'w-[72px]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand */}
      <div className="px-5 mb-8 flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white text-xl">badge</span>
        </div>
        <div
          className={`transition-all duration-200 whitespace-nowrap overflow-hidden ${
            isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          }`}
        >
          <p className="font-[Geist] text-lg text-primary tracking-tighter leading-none font-bold">JanasetuAI</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Civic Intelligence</p>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 transition-all duration-200 min-w-0 ${
                isActive
                  ? 'text-primary border-l-[3px] border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-black/5 hover:text-primary border-l-[3px] border-transparent'
              }`
            }
          >
            <span className="material-symbols-outlined shrink-0 text-[22px] w-[24px] text-center">{item.icon}</span>
            <span
              className={`transition-all duration-200 whitespace-nowrap overflow-hidden font-[Geist] text-sm ${
                isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* New Analysis CTA */}
      <button
        className={`mx-3 mt-auto mb-6 bg-gradient-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 overflow-hidden transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer`}
      >
        <span className="material-symbols-outlined text-xl">add</span>
        <span
          className={`transition-all duration-200 whitespace-nowrap overflow-hidden text-sm ${
            isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          }`}
        >
          New Analysis
        </span>
      </button>
    </nav>
  );
}
