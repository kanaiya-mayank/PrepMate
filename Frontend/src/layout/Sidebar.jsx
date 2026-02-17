/**
 * Sidebar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Collapsible sidebar for PrepMate. Expands on hover.
 * Props:
 *   isExpanded   — boolean, controlled by parent
 *   setIsExpanded — setter
 *   activeSection — string id of current page (e.g. 'dashboard', 'daily')
 *   onNavigate   — (sectionId: string) => void  called when nav item clicked
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import {
  LayoutGrid, Target, CalendarDays, CalendarRange,
  CalendarCheck, RefreshCw, ClipboardList, Timer,
  FolderOpen, CheckSquare, Zap, BookOpen,
  BarChart2, LogOut, Brain
} from 'lucide-react';
import { useAuth } from '../context/authContext';
import { logout }  from '../firebase/authService';
import { useNavigate } from 'react-router-dom';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard',   icon: LayoutGrid,    label: 'Dashboard'       },
    ],
  },
  {
    label: 'Planning',
    items: [
      { id: 'yearly',      icon: CalendarDays,  label: 'Yearly Planner'  },
      { id: 'monthly',     icon: CalendarRange, label: 'Monthly Planner' },
      { id: 'weekly',      icon: CalendarCheck, label: 'Weekly Planner'  },
      { id: 'daily',       icon: Target,        label: 'Daily Planner'   },
    ],
  },
  {
    label: 'Study',
    items: [
      { id: 'revision',    icon: RefreshCw,     label: 'Revision',   badge: 3 },
      { id: 'tests',       icon: ClipboardList, label: 'Tests & Errors'  },
      { id: 'timers',      icon: Timer,         label: 'Timing Tools'    },
    ],
  },
  {
    label: 'Resources',
    items: [
      { id: 'resources',   icon: FolderOpen,    label: 'File Manager'    },
    ],
  },
  {
    label: 'Productivity',
    items: [
      { id: 'habits',      icon: CheckSquare,   label: 'Habit Tracker'   },
      { id: 'distraction', icon: Zap,           label: 'Distraction Log' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { id: 'reflection',  icon: BookOpen,      label: 'Reflection'      },
      { id: 'reports',     icon: BarChart2,     label: 'Weekly Report'   },
    ],
  },
];

const Sidebar = ({ isExpanded, setIsExpanded, activeSection, onNavigate }) => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const displayName  = user?.displayName || user?.email?.split('@')[0] || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('[Sidebar] Logout failed:', err.message);
    }
  };

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`
        relative z-50 h-screen flex flex-col shrink-0
        bg-[#0a0d1c]/90 backdrop-blur-2xl
        border-r border-white/[0.05]
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-60 shadow-[4px_0_40px_rgba(0,0,0,0.6)]' : 'w-[68px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.05] shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600
          flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
          <Brain size={18} className="text-white" />
        </div>
        {isExpanded && (
          <span className="text-white font-black text-lg tracking-tight whitespace-nowrap
            animate-in fade-in slide-in-from-left-2 duration-200">
            Prep<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Mate</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2"
        style={{ scrollbarWidth: 'none' }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {isExpanded ? (
              <div className="px-4 pt-4 pb-1">
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600">
                  {group.label}
                </span>
              </div>
            ) : <div className="h-3" />}

            {group.items.map((item) => {
              const Icon     = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={!isExpanded ? item.label : undefined}
                  className={`
                    w-full flex items-center gap-3.5 px-[18px] py-2.5
                    text-left relative transition-all duration-150 group
                    ${isActive
                      ? 'text-white bg-blue-500/10 border-r-2 border-blue-500'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <Icon size={18} className={`shrink-0 transition-colors
                    ${isActive ? 'text-blue-400' : 'group-hover:text-slate-300'}`} />
                  {isExpanded && (
                    <span className="text-[13px] font-medium whitespace-nowrap animate-in fade-in duration-150">
                      {item.label}
                    </span>
                  )}
                  {item.badge && isExpanded && (
                    <span className="ml-auto text-[10px] font-black bg-red-500 text-white
                      px-1.5 py-0.5 rounded-full leading-none">{item.badge}</span>
                  )}
                  {item.badge && !isExpanded && (
                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="shrink-0 border-t border-white/[0.05] p-3">
        <div className={`flex items-center gap-2.5 p-2 rounded-xl
          ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600
              flex items-center justify-center text-xs font-bold text-white shrink-0">
              {avatarLetter}
            </div>
            {isExpanded && (
              <div className="min-w-0 animate-in fade-in duration-200">
                <p className="text-xs font-semibold text-slate-300 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-600 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          {isExpanded && (
            <button onClick={handleLogout} title="Sign out"
              className="text-slate-600 hover:text-red-400 transition-colors
                p-1.5 rounded-lg hover:bg-red-500/10 shrink-0">
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;