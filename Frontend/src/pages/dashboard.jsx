/**
 * dashboard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * PrepMate main dashboard - Enhanced with Global Revision Sync
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Menu, Flame, CheckCircle2, Zap, Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import Confetti from '../components/ui/Confetti';
import { useAuth } from '../context/authContext';
import { logout } from '../firebase/authService';

// Import the Centralized Service for Syncing
import { revisionService } from '../services/revisionService';

// ── Mock Static Data ──────────────────────────────────────────────────────────
const MOCK_TASKS = [
  { id: 1, subject: 'Algorithms',         title: 'Solve 20 problems – Trees & Graphs',    done: true  },
  { id: 2, subject: 'Operating Systems', title: 'Read OS Chapter 4 – Memory Management',  done: true  },
  { id: 3, subject: 'General Aptitude',  title: 'Revise Aptitude – Time & Work',          done: true  },
  { id: 4, subject: 'Computer Networks', title: 'Mock Test – CN Previous Year 2023',      done: false },
  { id: 5, subject: 'DBMS',               title: 'Practice DBMS – Normalization exercises', done: false },
  { id: 6, subject: 'Algorithms',         title: 'Solve GATE PYQ 2022 – Algorithms',       done: false },
];

const MOCK_DISTRACTION = { total: 45, items: [{ source: 'YouTube', mins: 25 }, { source: 'Phone', mins: 20 }] };
const QUOTE = { text: 'Success is not final, failure is not fatal — it is the courage to continue that counts.', author: 'Winston Churchill' };
const EXAM_NAME = 'GATE 2027';
const EXAM_DAYS_LEFT = 241;
const STREAK = 7;

const SUBJECT_COLOR = {
  'Algorithms':         'text-blue-400',
  'Operating Systems': 'text-violet-400',
  'DBMS':               'text-cyan-400',
  'Computer Networks': 'text-orange-400',
  'General Aptitude':  'text-yellow-400',
  'default':           'text-slate-400',
};

// ── Task Row Component ────────────────────────────────────────────────────────
const TaskRow = ({ task, onToggle, index }) => {
  const subjectColor = SUBJECT_COLOR[task.subject] || SUBJECT_COLOR.default;
  return (
    <div
      onClick={() => onToggle(task.id)}
      style={{ animationDelay: `${index * 50}ms` }}
      className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer
        border transition-all duration-200 group animate-in fade-in slide-in-from-left-1
        ${task.done
          ? 'bg-white/[0.02] border-white/[0.03] opacity-50'
          : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07] hover:border-blue-500/30'
        }`}
    >
      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0
        transition-all duration-200
        ${task.done ? 'bg-emerald-500 border-emerald-500 scale-95' : 'border-slate-600 group-hover:border-blue-500 group-hover:scale-105'}`}>
        {task.done && <CheckCircle2 size={13} strokeWidth={3} className="text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate transition-all
          ${task.done ? 'line-through text-slate-600' : 'text-slate-200 group-hover:text-white'}`}>
          {task.title}
        </p>
        <p className={`text-[11px] font-semibold mt-0.5 ${subjectColor}`}>{task.subject}</p>
      </div>
    </div>
  );
};

// ── Revision Row Component (Synced Version) ───────────────────────────────────
const RevisionRow = ({ rev, onDone }) => {
  const urgency = revisionService.getUrgencyStatus(rev.scheduled_date);
  const relativeDate = revisionService.formatRelativeDate(rev.scheduled_date);

  return (
    <div className={`flex items-center justify-between gap-3 p-3.5 rounded-xl
      border transition-all duration-200 group hover:border-emerald-500/30
      ${urgency === 'overdue' ? 'bg-red-500/5 border-red-500/20' :
        urgency === 'today'   ? 'bg-yellow-500/5 border-yellow-500/20' :
                                'bg-white/[0.03] border-white/[0.05]'}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg border-2 shrink-0
          ${rev.interval_day === 1  ? 'border-blue-500/30 text-blue-400' : 'border-indigo-500/30 text-indigo-400'}`}>
          <span className="text-[7px] font-black uppercase leading-none opacity-60">Day</span>
          <span className="text-sm font-black leading-none mt-0.5">{rev.interval_day}</span>
        </div>
        <div className="min-w-0 text-left">
          <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
            {rev.topic_name}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-tighter">
            {rev.subject} · {urgency === 'overdue' ? `⚠️ ${relativeDate}` : `📅 ${relativeDate}`}
          </p>
        </div>
      </div>
      <button
        onClick={() => onDone(rev.id)}
        className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg
          bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
          hover:bg-emerald-500/20 hover:scale-105 active:scale-95
          transition-all duration-200"
      >
        ✓ Done
      </button>
    </div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [revisions, setRevisions] = useState([]);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());

  // Function to refresh revisions from the shared service
  const refreshRevisions = useCallback(() => {
    const data = revisionService.getDueRevisions().filter(rev => {
      const status = revisionService.getUrgencyStatus(rev.scheduled_date);
      return status === 'overdue' || status === 'today';
    });
    setRevisions(data);
  }, []);

  useEffect(() => {
    refreshRevisions();
  }, [refreshRevisions]);

  const today = useMemo(() => new Date(), []);
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Aspirant';
  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const completedCount = tasks.filter(t => t.done).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  const triggerCelebration = useCallback(() => {
    const pieces = Array.from({ length: 60 }).map((_, i) => ({
      id: Math.random(),
      x: Math.random() * 100,
      color: ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'][i % 6],
      delay: Math.random() * 0.3,
      duration: 2 + Math.random() * 1.5,
    }));
    setConfettiPieces(prev => [...prev, ...pieces]);
    setTimeout(() => setConfettiPieces(prev => prev.filter(p => !pieces.includes(p))), 4000);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (!t.done) triggerCelebration();
      return { ...t, done: !t.done };
    }));
  }, [triggerCelebration]);

 // Ensure you use the centralized toggle logic
const markRevisionDone = useCallback((id) => {
  revisionService.toggleStatus(id); // Use toggle instead of one-way complete
  
  // Refresh dashboard list (only showing pending)
  const data = revisionService.getDueRevisions().filter(rev => {
    const status = revisionService.getUrgencyStatus(rev.scheduled_date);
    return status === 'overdue' || status === 'today';
  });
  setRevisions(data);
}, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err.message);
    }
  };

 const handleNavigate = (section) => {
  // Define which IDs should trigger a URL change
  const externalRoutes = ['revision', 'daily', 'habits', 'tests']; 
  
  if (externalRoutes.includes(section)) {
    navigate(`/${section}`);
  } else {
    setActiveSection(section);
  }
};import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Menu, Flame, CheckCircle2, Zap, Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import Confetti from '../components/ui/Confetti';
import { useAuth } from '../context/authContext';
import { logout } from '../firebase/authService';
import { revisionService } from '../services/revisionService';

const MOCK_TASKS = [
  { id: 1, subject: 'Algorithms', title: 'Solve 20 problems – Trees & Graphs', done: true },
  { id: 2, subject: 'Operating Systems', title: 'Read OS Chapter 4 – Memory Management', done: true },
  { id: 3, subject: 'General Aptitude', title: 'Revise Aptitude – Time & Work', done: true },
  { id: 4, subject: 'Computer Networks', title: 'Mock Test – CN Previous Year 2023', done: false },
  { id: 5, subject: 'DBMS', title: 'Practice DBMS – Normalization exercises', done: false },
  { id: 6, subject: 'Algorithms', title: 'Solve GATE PYQ 2022 – Algorithms', done: false },
];

const MOCK_DISTRACTION = { total: 45, items: [{ source: 'YouTube', mins: 25 }, { source: 'Phone', mins: 20 }] };
const QUOTE = { text: 'Success is not final, failure is not fatal — it is the courage to continue that counts.', author: 'Winston Churchill' };
const EXAM_NAME = 'GATE 2027';
const EXAM_DAYS_LEFT = 241;
const STREAK = 7;

const SUBJECT_COLOR = {
  'Algorithms': 'text-blue-400',
  'Operating Systems': 'text-violet-400',
  'DBMS': 'text-cyan-400',
  'Computer Networks': 'text-orange-400',
  'General Aptitude': 'text-yellow-400',
  'default': 'text-slate-400',
};

const TaskRow = ({ task, onToggle, index }) => {
  const subjectColor = SUBJECT_COLOR[task.subject] || SUBJECT_COLOR.default;
  return (
    <div onClick={() => onToggle(task.id)} style={{ animationDelay: `${index * 50}ms` }}
      className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer border transition-all duration-200 group animate-in fade-in slide-in-from-left-1
        ${task.done ? 'bg-white/[0.02] border-white/[0.03] opacity-50' : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07] hover:border-blue-500/30'}`}>
      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200
        ${task.done ? 'bg-emerald-500 border-emerald-500 scale-95' : 'border-slate-600 group-hover:border-blue-500 group-hover:scale-105'}`}>
        {task.done && <CheckCircle2 size={13} strokeWidth={3} className="text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate transition-all ${task.done ? 'line-through text-slate-600' : 'text-slate-200 group-hover:text-white'}`}>{task.title}</p>
        <p className={`text-[11px] font-semibold mt-0.5 ${subjectColor}`}>{task.subject}</p>
      </div>
    </div>
  );
};

const RevisionRow = ({ rev, onDone }) => {
  const urgency = revisionService.getUrgencyStatus(rev.scheduled_date);
  const relativeDate = revisionService.formatRelativeDate(rev.scheduled_date);
  return (
    <div className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200 group hover:border-emerald-500/30
      ${urgency === 'overdue' ? 'bg-red-500/5 border-red-500/20' : urgency === 'today' ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-white/[0.03] border-white/[0.05]'}`}>
      <div className="flex items-center gap-3 min-w-0 text-left">
        <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg border-2 shrink-0 ${rev.interval_day === 1 ? 'border-blue-500/30 text-blue-400' : 'border-indigo-500/30 text-indigo-400'}`}>
          <span className="text-[7px] font-black uppercase leading-none opacity-60">Day</span>
          <span className="text-sm font-black leading-none mt-0.5">{rev.interval_day}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{rev.topic_name}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-tighter">
            {rev.subject} · {urgency === 'overdue' ? `⚠️ ${relativeDate}` : `📅 ${relativeDate}`}
          </p>
        </div>
      </div>
      <button onClick={() => onDone(rev.id)} className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-200">✓ Done</button>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [revisions, setRevisions] = useState([]);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());

  const refreshRevisions = useCallback(() => {
    const data = revisionService.getDueRevisions().filter(rev => {
      const status = revisionService.getUrgencyStatus(rev.scheduled_date);
      return status === 'overdue' || status === 'today';
    });
    setRevisions(data);
  }, []);

  useEffect(() => { refreshRevisions(); }, [refreshRevisions]);

  const today = useMemo(() => new Date(), []);
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Aspirant';
  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const completedCount = tasks.filter(t => t.done).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  const triggerCelebration = useCallback(() => {
    const pieces = Array.from({ length: 60 }).map((_, i) => ({
      id: Math.random(),
      x: Math.random() * 100,
      color: ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'][i % 6],
      delay: Math.random() * 0.3,
      duration: 2 + Math.random() * 1.5,
    }));
    setConfettiPieces(prev => [...prev, ...pieces]);
    setTimeout(() => setConfettiPieces(prev => prev.filter(p => !pieces.includes(p))), 4000);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (!t.done) triggerCelebration();
      return { ...t, done: !t.done };
    }));
  }, [triggerCelebration]);

  const markRevisionDone = useCallback((id) => {
    revisionService.toggleStatus(id);
    refreshRevisions();
  }, [refreshRevisions]);

  const handleLogout = async () => {
    try { await logout(); navigate('/login', { replace: true }); } catch (err) { console.error(err.message); }
  };

  const handleNavigate = (section) => {
    const externalRoutes = ['revision', 'daily', 'habits', 'tests']; 
    if (externalRoutes.includes(section)) { navigate(`/${section}`); } 
    else { setActiveSection(section); }
  };

  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const dateLabel = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

  return (
    <div className="min-h-screen w-full bg-[#060914] text-slate-300 flex overflow-hidden">
      <Confetti pieces={confettiPieces} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/3 w-[500px] h-[350px] rounded-full bg-blue-600/4 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[300px] rounded-full bg-violet-600/4 blur-[100px]" />
      </div>
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} activeSection={activeSection} onNavigate={handleNavigate} />
      <main className="flex-1 h-screen overflow-y-auto flex flex-col relative z-10">
        <header className="sticky top-0 z-20 bg-[#060914]/90 backdrop-blur-xl border-b border-white/[0.05] px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsExpanded(v => !v)} className="text-slate-500 hover:text-white transition-colors"><Menu size={20} /></button>
            <div>
              <h1 className="text-base font-black text-white leading-tight">{greeting}, <span className="text-blue-400">{displayName}</span> 👋</h1>
              <p className="text-[11px] text-slate-600">{dateLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs font-black text-orange-300">{STREAK} day streak</span>
            </div>
            <button onClick={handleLogout} className="text-xs font-semibold text-slate-500 hover:text-red-400 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-500/20 transition-all duration-200">Sign out</button>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
            <div className="space-y-6 text-left">
              <div className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">📌 TODAY'S TASKS</h2>
                  <span className={`text-sm font-black px-3.5 py-1.5 rounded-full border ${progressPct === 100 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>{progressPct}%</span>
                </div>
                <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden mb-5">
                  <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="space-y-2.5">{tasks.map((task, i) => <TaskRow key={task.id} task={task} onToggle={toggleTask} index={i} />)}</div>
              </div>
              <div className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm text-left">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">🔄 DUE REVISIONS {revisions.length > 0 && <span className="text-xs font-black bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">{revisions.length}</span>}</h2>
                  <button onClick={() => handleNavigate('revision')} className="text-[11px] text-blue-400 hover:underline font-semibold uppercase tracking-widest">View all →</button>
                </div>
                <div className="space-y-2.5">{revisions.length > 0 ? revisions.map(rev => <RevisionRow key={rev.id} rev={rev} onDone={markRevisionDone} />) : <div className="text-center py-8 text-slate-600"><div className="text-4xl mb-2">✅</div><p className="text-sm font-medium">All revisions synced & done!</p></div>}</div>
              </div>
            </div>
            <div className="space-y-5 text-left">
              <div className="bg-gradient-to-br from-blue-600/10 via-blue-600/5 to-violet-600/10 border border-blue-500/20 rounded-2xl p-6 text-center group">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{EXAM_NAME}</p>
                <div className="text-6xl font-black text-white leading-none mb-2 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform">{EXAM_DAYS_LEFT}</div>
                <p className="text-xs text-slate-400 font-semibold mb-4">days remaining</p>
                <div className="h-2 w-full bg-white/[0.08] rounded-full overflow-hidden"><div className="h-full w-[38%] rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" /></div>
              </div>
              <div className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1))} className="text-slate-500 hover:text-white transition-colors"><ChevronLeft size={16}/></button>
                  <span className="text-xs font-bold text-slate-300">{monthLabel}</span>
                  <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1))} className="text-slate-500 hover:text-white transition-colors"><ChevronRight size={16}/></button>
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                  {['M','T','W','T','F','S','S'].map((d, i) => <div key={i} className="text-[10px] font-black text-slate-600 text-center">{d}</div>)}
                  {Array.from({ length: daysInMonth }).map((_, i) => <div key={i} className={`text-[11px] text-center py-2 rounded-lg ${(i+1) === today.getDate() && viewDate.getMonth() === today.getMonth() ? 'bg-blue-600 text-white font-black scale-110 shadow-lg shadow-blue-500/40' : 'text-slate-600'}`}>{i+1}</div>)}
                </div>
              </div>
              <div className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Zap size={18} className="text-orange-400" /></div><div><p className="text-sm font-semibold text-slate-200">Distractions Today</p><p className="text-[11px] text-slate-600">{MOCK_DISTRACTION.items.map(d => `${d.source}: ${d.mins}m`).join(' · ')}</p></div></div>
                <span className="text-xl font-black text-orange-400">{MOCK_DISTRACTION.total}m</span>
              </div>
              <div className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl p-5 group">
                <div className="flex items-start gap-3"><Brain size={16} className="text-blue-400 shrink-0 mt-0.5 opacity-50 group-hover:opacity-100" /><div><p className="text-[13px] text-slate-400 italic leading-relaxed">"{QUOTE.text}"</p><p className="text-[11px] text-blue-400 font-bold mt-2.5">— {QUOTE.author}</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const dateLabel = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Calendar logic
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

  return (
    <div className="min-h-screen w-full bg-[#060914] text-slate-300 flex overflow-hidden">
      <Confetti pieces={confettiPieces} />
      
      {/* Glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/3 w-[500px] h-[350px] rounded-full bg-blue-600/4 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[300px] rounded-full bg-violet-600/4 blur-[100px]" />
      </div>

      <Sidebar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 h-screen overflow-y-auto flex flex-col relative z-10">
        <header className="sticky top-0 z-20 bg-[#060914]/90 backdrop-blur-xl border-b border-white/[0.05] px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsExpanded(v => !v)} className="text-slate-500 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-black text-white leading-tight">
                {greeting}, <span className="text-blue-400">{displayName}</span> 👋
              </h1>
              <p className="text-[11px] text-slate-600">{dateLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs font-black text-orange-300">{STREAK} day streak</span>
            </div>
            <button onClick={handleLogout} className="text-xs font-semibold text-slate-500 hover:text-red-400 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-500/20 transition-all duration-200">
              Sign out
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              <div className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">📌 TODAY'S TASKS</h2>
                  <span className={`text-sm font-black px-3.5 py-1.5 rounded-full border ${progressPct === 100 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                    {progressPct}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden mb-5">
                  <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="space-y-2.5">
                  {tasks.map((task, i) => <TaskRow key={task.id} task={task} onToggle={toggleTask} index={i} />)}
                </div>
              </div>

              {/* Spaced Revision Section */}
              <div className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm text-left">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                    🔄 DUE REVISIONS
                    {revisions.length > 0 && <span className="text-xs font-black bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">{revisions.length}</span>}
                  </h2>
                  <button onClick={() => handleNavigate('revision')} className="text-[11px] text-blue-400 hover:underline font-semibold uppercase tracking-widest">View all →</button>
                </div>
                <div className="space-y-2.5">
                  {revisions.length > 0 ? revisions.map(rev => <RevisionRow key={rev.id} rev={rev} onDone={markRevisionDone} />) : (
                    <div className="text-center py-8 text-slate-600">
                      <div className="text-4xl mb-2">✅</div>
                      <p className="text-sm font-medium">All revisions synced & done!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-blue-600/10 via-blue-600/5 to-violet-600/10 border border-blue-500/20 rounded-2xl p-6 text-center group">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{EXAM_NAME}</p>
                <div className="text-6xl font-black text-white leading-none mb-2 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform">{EXAM_DAYS_LEFT}</div>
                <p className="text-xs text-slate-400 font-semibold mb-4">days remaining</p>
                <div className="h-2 w-full bg-white/[0.08] rounded-full overflow-hidden">
                   <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                </div>
              </div>

              {/* Mini Calendar */}
              <div className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm text-left">
                <div className="flex items-center justify-between mb-4">
                   <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1))} className="text-slate-500 hover:text-white transition-colors"><ChevronLeft size={16}/></button>
                   <span className="text-xs font-bold text-slate-300">{monthLabel}</span>
                   <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1))} className="text-slate-500 hover:text-white transition-colors"><ChevronRight size={16}/></button>
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                  {['M','T','W','T','F','S','S'].map((d, i) => <div key={i} className="text-[10px] font-black text-slate-600 text-center">{d}</div>)}
                  {Array.from({ length: daysInMonth }).map((_, i) => (
                    <div key={i} className={`text-[11px] text-center py-2 rounded-lg ${(i+1) === today.getDate() && viewDate.getMonth() === today.getMonth() ? 'bg-blue-600 text-white font-black scale-110 shadow-lg shadow-blue-500/40' : 'text-slate-600'}`}>{i+1}</div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between group text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Zap size={18} className="text-orange-400" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Distractions Today</p>
                    <p className="text-[11px] text-slate-600">{MOCK_DISTRACTION.items.map(d => `${d.source}: ${d.mins}m`).join(' · ')}</p>
                  </div>
                </div>
                <span className="text-xl font-black text-orange-400">{MOCK_DISTRACTION.total}m</span>
              </div>

              <div className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl p-5 group text-left">
                <div className="flex items-start gap-3">
                  <Brain size={16} className="text-blue-400 shrink-0 mt-0.5 opacity-50 group-hover:opacity-100" />
                  <div>
                    <p className="text-[13px] text-slate-400 italic leading-relaxed">"{QUOTE.text}"</p>
                    <p className="text-[11px] text-blue-400 font-bold mt-2.5">— {QUOTE.author}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;