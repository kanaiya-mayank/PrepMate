// import React, { useState, useCallback, useMemo } from 'react';
// import { Menu, Flame, Moon, LayoutGrid, Target, Clock, BarChart2, Timer, Brain, FolderOpen, Settings } from 'lucide-react';
// import Sidebar from '../components/layout/Sidebar';
// import Confetti from '../components/ui/Confetti';
// import TaskSection from '../features/dashboard/TaskSection';
// import RevisionSection from '../features/dashboard/RevisionSection';
// import MiniCalendar from '../features/calendar/MiniCalendar';

// const NAV_ITEMS = [
//   { icon: <LayoutGrid size={20}/>, label: "Dashboard", active: true },
//   { icon: <Target size={20}/>, label: "Planner" },
//   { icon: <Clock size={20}/>, label: "Revision" },
//   { icon: <BarChart2 size={20}/>, label: "Test Analysis" },
//   { icon: <Timer size={20}/>, label: "Timers" },
//   { icon: <Brain size={20}/>, label: "Reflection" },
//   { icon: <FolderOpen size={20}/>, label: "Resources" },
//   { icon: <Settings size={20}/>, label: "Settings" },
// ];

// const Dashboard = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [confettiPieces, setConfettiPieces] = useState([]);
//   const celebrationAudio = useMemo(() => new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'), []);

//   const triggerCelebration = useCallback(() => {
//     celebrationAudio.currentTime = 0;
//     celebrationAudio.volume = 0.3;
//     celebrationAudio.play().catch(() => {});
//     const newPieces = Array.from({ length: 40 }).map((_, i) => ({
//       id: Math.random(), x: Math.random() * 100, color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ffffff'][i % 5],
//       delay: Math.random() * 0.5, duration: 2 + Math.random() * 2
//     }));
//     setConfettiPieces(prev => [...prev, ...newPieces]);
//     setTimeout(() => setConfettiPieces(prev => prev.filter(p => !newPieces.includes(p))), 4000);
//   }, [celebrationAudio]);

//   const today = useMemo(() => new Date(), []); 
//   const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
//   const [tasks, setTasks] = useState([
//     { id: 1, title: 'COA – Pipelining', completed: true },
//     { id: 2, title: 'OS – Deadlocks', completed: false },
//     { id: 3, title: 'DBMS – Normal Forms', completed: false },
//   ]);

//   const [revisions, setRevisions] = useState([
//     { id: 101, title: 'COA – Cache Memory', time: '1-day', completed: false },
//     { id: 102, title: 'OS – Scheduling', time: '3-day', completed: false },
//   ]);

//   const firstDay = (new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() + 6) % 7;
//   const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

//   return (
//     <div className="min-h-screen w-full bg-[#050614] text-[#a0a5b8] font-sans flex overflow-hidden select-none">
//       <Confetti pieces={confettiPieces} />
//       <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none animate-pulse duration-[10s]" />
      
//       <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} navItems={NAV_ITEMS} />
      
//       <main className="flex-1 h-screen overflow-y-auto flex flex-col z-10 scroll-smooth">
//         <header className="w-full bg-[#0d0f22]/40 border-b border-white/5 backdrop-blur-md px-10 py-5 flex justify-between items-center sticky top-0 z-20">
//           <div className="flex items-center gap-6">
//             <Menu size={22} className="cursor-pointer text-slate-400 hover:text-white" onClick={() => setIsExpanded(!isExpanded)} />
//             <span className="text-xs italic text-slate-500 tracking-wide animate-pulse">Stay consistent today</span>
//           </div>
//           <div className="flex items-center space-x-8">
//             <div className="flex items-center space-x-2">
//               <Flame size={18} className="text-orange-500" />
//               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Streak: 10</span>
//             </div>
//             <button className="bg-white/5 p-2 rounded-full border border-white/10"><Moon size={18} /></button>
//           </div>
//         </header>

//         <div className="p-8 md:p-12 flex flex-col items-center max-w-[1400px] mx-auto w-full animate-in fade-in duration-700">
//           <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full mb-12">
//             <div className="xl:col-span-8 space-y-8">
//               <TaskSection 
//                 tasks={tasks} 
//                 toggleTask={(id) => {
//                   const t = tasks.find(x => x.id === id);
//                   if(!t.completed) triggerCelebration();
//                   setTasks(prev => prev.map(x => x.id === id ? {...x, completed: !x.completed} : x));
//                 }} 
//                 completedCount={tasks.filter(x => x.completed).length} 
//                 progressPercent={(tasks.filter(x => x.completed).length / tasks.length) * 100} 
//               />
//               <RevisionSection 
//                 revisions={revisions} 
//                 toggleRevision={(id) => {
//                   const r = revisions.find(x => x.id === id);
//                   if(!r.completed) triggerCelebration();
//                   setRevisions(prev => prev.map(x => x.id === id ? {...x, completed: !x.completed} : x));
//                 }} 
//               />
//             </div>
            
//             <MiniCalendar 
//                 viewDate={viewDate} 
//                 setViewDate={setViewDate} 
//                 today={today} 
//                 firstDay={firstDay} 
//                 daysInMonth={daysInMonth} 
//             />
//           </div>
          
//           <section className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden self-center transition-all hover:bg-white/10 hover:scale-[1.02] duration-500 group text-center">
//              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Brain size={60} className="text-blue-400" /></div>
//              <p className="text-lg italic text-slate-200 font-medium leading-relaxed group-hover:text-white transition-colors">"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
//              <div className="flex items-center justify-center space-x-3 mt-4">
//                 <div className="h-px w-8 bg-blue-500 transition-all group-hover:w-12"></div>
//                 <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">Winston Churchill</span>
//                 <div className="h-px w-8 bg-blue-500 transition-all group-hover:w-12"></div>
//              </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

/**
 * dashboard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * PrepMate main dashboard page.
 *
 * Sections shown:
 *  - Stat cards (tasks, revisions, streak, countdown)
 *  - Today's Tasks (with progress bar + confetti on completion)
 *  - Due Revisions (spaced repetition)
 *  - Mini Calendar + Exam Countdown
 *  - Distraction summary
 *  - Motivational quote
 *
 * All data is static mock data for now.
 * TODO (Backend dev): replace MOCK_* constants with API calls via useEffect + api.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Menu, Flame, CheckCircle2, RefreshCw,
         BookOpen, Zap, BarChart2, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar    from '../layout/Sidebar';
import Confetti   from '../components/ui/Confetti';
import { useAuth } from '../context/authContext';
import { logout }  from '../firebase/authService';

// ── Mock data (replace with API calls later) ──────────────────────────────────
const MOCK_TASKS = [
  { id: 1, subject: 'Algorithms',        title: 'Solve 20 problems – Trees & Graphs',     done: true  },
  { id: 2, subject: 'Operating Systems', title: 'Read OS Chapter 4 – Memory Management',  done: true  },
  { id: 3, subject: 'General Aptitude',  title: 'Revise Aptitude – Time & Work',          done: true  },
  { id: 4, subject: 'Computer Networks', title: 'Mock Test – CN Previous Year 2023',      done: false },
  { id: 5, subject: 'DBMS',             title: 'Practice DBMS – Normalization exercises', done: false },
  { id: 6, subject: 'Algorithms',        title: 'Solve GATE PYQ 2022 – Algorithms',       done: false },
];

const MOCK_REVISIONS = [
  { id: 101, topic: 'Dynamic Programming – Basics',  subject: 'Algorithms',        dueLabel: '⚠️ 2 days overdue', urgency: 'overdue' },
  { id: 102, topic: 'Computer Networks – TCP/IP',    subject: 'Computer Networks', dueLabel: '📅 Due today · Day-7', urgency: 'today'   },
  { id: 103, topic: 'OS – Process Scheduling',       subject: 'Operating Systems', dueLabel: '📅 Due today · Day-3', urgency: 'today'   },
];

const MOCK_DISTRACTION = { total: 45, items: [{ source: 'YouTube', mins: 25 }, { source: 'Phone', mins: 20 }] };

const QUOTE = { text: 'Success is not final, failure is not fatal — it is the courage to continue that counts.', author: 'Winston Churchill' };

const EXAM_NAME = 'GATE 2027';
const EXAM_DAYS_LEFT = 241;
const STREAK = 7;

// Subject → color accent
const SUBJECT_COLOR = {
  'Algorithms':        'text-blue-400',
  'Operating Systems': 'text-violet-400',
  'DBMS':              'text-cyan-400',
  'Computer Networks': 'text-orange-400',
  'General Aptitude':  'text-yellow-400',
  'default':           'text-slate-400',
};

// ── Sub-components ────────────────────────────────────────────────────────────

// Stat card
const StatCard = ({ icon: Icon, iconColor, value, label, sub, accentClass }) => (
  <div className={`relative bg-[#0f1629]/80 border border-white/[0.06] rounded-2xl p-5
    overflow-hidden group hover:border-white/[0.1] transition-all duration-300`}>
    <div className={`absolute top-0 left-0 right-0 h-[2px] ${accentClass}`} />
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3
      bg-white/[0.04] border border-white/[0.05] ${iconColor}`}>
      <Icon size={18} />
    </div>
    <div className="text-2xl font-black text-white leading-none mb-1">{value}</div>
    <div className="text-xs font-semibold text-slate-400">{label}</div>
    {sub && <div className="text-[11px] text-slate-600 mt-0.5">{sub}</div>}
  </div>
);

// Task row
const TaskRow = ({ task, onToggle, index }) => {
  const subjectColor = SUBJECT_COLOR[task.subject] || SUBJECT_COLOR.default;
  return (
    <div
      onClick={() => onToggle(task.id)}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer
        border transition-all duration-200 group animate-in fade-in
        ${task.done
          ? 'bg-white/[0.02] border-white/[0.03] opacity-60'
          : 'bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1]'
        }`}
    >
      {/* Checkbox */}
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0
        transition-all duration-200
        ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 group-hover:border-blue-500'}`}>
        {task.done && <CheckCircle2 size={13} className="text-white" />}
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate transition-all duration-200
          ${task.done ? 'line-through text-slate-600' : 'text-slate-200'}`}>
          {task.title}
        </p>
        <p className={`text-[11px] font-medium mt-0.5 ${subjectColor}`}>{task.subject}</p>
      </div>
    </div>
  );
};

// Revision row
const RevisionRow = ({ rev, onDone }) => (
  <div className={`flex items-center justify-between gap-3 p-3.5 rounded-xl
    border transition-all duration-200
    ${rev.urgency === 'overdue' ? 'bg-red-500/5 border-red-500/20' :
      rev.urgency === 'today'   ? 'bg-yellow-500/5 border-yellow-500/20' :
                                  'bg-white/[0.03] border-white/[0.05]'}`}>
    <div className="min-w-0">
      <p className="text-sm font-medium text-slate-200 truncate">{rev.topic}</p>
      <p className="text-[11px] text-slate-500 mt-0.5">{rev.dueLabel}</p>
    </div>
    <button
      onClick={() => onDone(rev.id)}
      className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg
        bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
        hover:bg-emerald-500/20 transition-all duration-200 whitespace-nowrap"
    >
      ✓ Done
    </button>
  </div>
);

// Mini calendar
const MiniCalendar = ({ today }) => {
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const firstDay    = (new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const monthLabel  = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-[#0f1629]/80 border border-white/[0.06] rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1))}
          className="text-slate-500 hover:text-white transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.06]">
          ‹
        </button>
        <span className="text-xs font-bold text-slate-300 tracking-wide">{monthLabel}</span>
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1))}
          className="text-slate-500 hover:text-white transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.06]">
          ›
        </button>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="text-[10px] font-black text-slate-600 text-center py-1">{d}</div>
        ))}
      </div>
      {/* Days */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate()
            && viewDate.getMonth() === today.getMonth()
            && viewDate.getFullYear() === today.getFullYear();
          return (
            <div key={day} className={`text-[11px] text-center py-1.5 rounded-lg cursor-pointer
              transition-all duration-150
              ${isToday ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30'
                       : 'text-slate-600 hover:text-white hover:bg-white/[0.05]'}`}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [isExpanded, setIsExpanded]         = useState(false);
  const [activeSection, setActiveSection]   = useState('dashboard');
  const [tasks, setTasks]                   = useState(MOCK_TASKS);
  const [revisions, setRevisions]           = useState(MOCK_REVISIONS);
  const [confettiPieces, setConfettiPieces] = useState([]);

  const today       = useMemo(() => new Date(), []);
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Aspirant';
  const greeting    = (() => {
    const h = today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const completedCount = tasks.filter(t => t.done).length;
  const progressPct    = Math.round((completedCount / tasks.length) * 100);

  // Confetti trigger
  const triggerCelebration = useCallback(() => {
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: Math.random(),
      x: Math.random() * 100,
      color: ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'][i % 6],
      delay: Math.random() * 0.4,
      duration: 2 + Math.random() * 2,
    }));
    setConfettiPieces(prev => [...prev, ...pieces]);
    setTimeout(() => setConfettiPieces(prev => prev.filter(p => !pieces.includes(p))), 4500);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (!t.done) triggerCelebration();
      return { ...t, done: !t.done };
    }));
  }, [triggerCelebration]);

  const markRevisionDone = useCallback((id) => {
    setRevisions(prev => prev.filter(r => r.id !== id));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err.message);
    }
  };

  // Navigation handler — will expand to router-based navigation in later modules
  const handleNavigate = (section) => {
    setActiveSection(section);
    // TODO: navigate(`/${section}`) when other pages are ready
  };

  const dateLabel = today.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen w-full bg-[#060914] text-slate-300 flex overflow-hidden">
      <Confetti pieces={confettiPieces} />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full
          bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full
          bg-violet-600/5 blur-[100px]" />
      </div>

      {/* Sidebar */}
      <Sidebar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col">

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-[#060914]/80 backdrop-blur-xl
          border-b border-white/[0.05] px-6 md:px-8 py-4
          flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExpanded(v => !v)}
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-black text-white leading-tight">
                {greeting}, <span className="text-blue-400">{displayName}</span> 👋
              </h1>
              <p className="text-[11px] text-slate-600">{dateLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20
              px-3 py-1.5 rounded-full">
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs font-black text-orange-300">{STREAK} day streak</span>
            </div>
            {/* Logout */}
            <button onClick={handleLogout}
              className="text-xs font-semibold text-slate-500 hover:text-red-400
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                hover:bg-red-500/10 border border-transparent hover:border-red-500/20
                transition-all duration-200">
              Sign out
            </button>
          </div>
        </header>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <div className="flex-1 p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto w-full">

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={CheckCircle2} iconColor="text-blue-400"
              accentClass="bg-gradient-to-r from-blue-500 to-cyan-500"
              value={`${completedCount}/${tasks.length}`}
              label="Tasks Today"
              sub={`${tasks.length - completedCount} remaining`}
            />
            <StatCard
              icon={RefreshCw} iconColor="text-violet-400"
              accentClass="bg-gradient-to-r from-violet-500 to-pink-500"
              value={revisions.length}
              label="Due Revisions"
              sub={`${revisions.filter(r => r.urgency === 'overdue').length} overdue`}
            />
            <StatCard
              icon={Flame} iconColor="text-orange-400"
              accentClass="bg-gradient-to-r from-orange-500 to-yellow-500"
              value={`${STREAK} days`}
              label="Study Streak"
              sub="Personal best: 14"
            />
            <StatCard
              icon={BarChart2} iconColor="text-emerald-400"
              accentClass="bg-gradient-to-r from-emerald-500 to-teal-500"
              value={EXAM_DAYS_LEFT}
              label={`Days to ${EXAM_NAME}`}
              sub="Keep pushing!"
            />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left col — Tasks + Revisions */}
            <div className="xl:col-span-2 space-y-6">

              {/* Tasks card */}
              <div className="bg-[#0f1629]/80 border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">
                      📌 Today's Tasks
                    </h2>
                    <p className="text-[11px] text-slate-600 mt-0.5">Click a task to mark complete</p>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full border
                    ${progressPct === 100
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                    {progressPct}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden mb-5">
                  <div
                    className="h-full rounded-full transition-all duration-700
                      bg-gradient-to-r from-blue-500 to-cyan-500
                      shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                {/* Task list */}
                <div className="space-y-2">
                  {tasks.map((task, i) => (
                    <TaskRow key={task.id} task={task} onToggle={toggleTask} index={i} />
                  ))}
                </div>
                {progressPct === 100 && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                    text-emerald-400 text-sm font-semibold text-center animate-in fade-in">
                    🎉 All tasks done! Streak maintained!
                  </div>
                )}
              </div>

              {/* Revisions card */}
              <div className="bg-[#0f1629]/80 border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">
                      🔄 Due Revisions
                    </h2>
                    <p className="text-[11px] text-slate-600 mt-0.5">Spaced repetition schedule</p>
                  </div>
                  <button
                    onClick={() => handleNavigate('revision')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold
                      transition-colors">
                    View all →
                  </button>
                </div>
                {revisions.length > 0 ? (
                  <div className="space-y-2">
                    {revisions.map(rev => (
                      <RevisionRow key={rev.id} rev={rev} onDone={markRevisionDone} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-600 text-sm">
                    ✅ All revisions done for today!
                  </div>
                )}
              </div>

              {/* Distraction summary */}
              <div className="bg-[#0f1629]/80 border border-white/[0.06] rounded-2xl p-5
                flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20
                    flex items-center justify-center">
                    <Zap size={16} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Distractions Today</p>
                    <p className="text-[11px] text-slate-600">
                      {MOCK_DISTRACTION.items.map(d => `${d.source}: ${d.mins}m`).join(' · ')}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-black text-orange-400 shrink-0">
                  {MOCK_DISTRACTION.total} min
                </span>
              </div>
            </div>

            {/* Right col — Calendar + Countdown + Quote */}
            <div className="space-y-5">

              {/* Exam countdown */}
              <div className="bg-gradient-to-br from-blue-600/10 to-violet-600/10
                border border-blue-500/20 rounded-2xl p-5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
                  {EXAM_NAME}
                </p>
                <div className="text-5xl font-black text-white leading-none mb-1
                  drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                  {EXAM_DAYS_LEFT}
                </div>
                <p className="text-xs text-slate-500 font-medium">days remaining</p>
                <div className="mt-3 h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full w-[38%] rounded-full
                    bg-gradient-to-r from-blue-500 to-cyan-500
                    shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
                </div>
                <p className="text-[10px] text-slate-600 mt-1.5">38% of prep time elapsed</p>
              </div>

              {/* Mini calendar */}
              <MiniCalendar today={today} />

              {/* Quote */}
              <div className="bg-[#0f1629]/80 border border-white/[0.06] rounded-2xl p-5 group
                hover:border-blue-500/20 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <Brain size={16} className="text-blue-400 shrink-0 mt-0.5 opacity-60" />
                  <div>
                    <p className="text-[13px] text-slate-400 italic leading-relaxed
                      group-hover:text-slate-300 transition-colors">
                      "{QUOTE.text}"
                    </p>
                    <p className="text-[11px] text-blue-400 font-bold mt-2 tracking-wide">
                      — {QUOTE.author}
                    </p>
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