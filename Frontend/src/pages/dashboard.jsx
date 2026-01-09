import React, { useState, useCallback, useMemo } from 'react';
import { Menu, Flame, Moon, LayoutGrid, Target, Clock, BarChart2, Timer, Brain, FolderOpen, Settings } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Confetti from '../components/ui/Confetti';
import TaskSection from '../features/dashboard/TaskSection';
import RevisionSection from '../features/dashboard/RevisionSection';
import MiniCalendar from '../features/calendar/MiniCalendar';

const NAV_ITEMS = [
  { icon: <LayoutGrid size={20}/>, label: "Dashboard", active: true },
  { icon: <Target size={20}/>, label: "Planner" },
  { icon: <Clock size={20}/>, label: "Revision" },
  { icon: <BarChart2 size={20}/>, label: "Test Analysis" },
  { icon: <Timer size={20}/>, label: "Timers" },
  { icon: <Brain size={20}/>, label: "Reflection" },
  { icon: <FolderOpen size={20}/>, label: "Resources" },
  { icon: <Settings size={20}/>, label: "Settings" },
];

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const celebrationAudio = useMemo(() => new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'), []);

  const triggerCelebration = useCallback(() => {
    celebrationAudio.currentTime = 0;
    celebrationAudio.volume = 0.3;
    celebrationAudio.play().catch(() => {});
    const newPieces = Array.from({ length: 40 }).map((_, i) => ({
      id: Math.random(), x: Math.random() * 100, color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ffffff'][i % 5],
      delay: Math.random() * 0.5, duration: 2 + Math.random() * 2
    }));
    setConfettiPieces(prev => [...prev, ...newPieces]);
    setTimeout(() => setConfettiPieces(prev => prev.filter(p => !newPieces.includes(p))), 4000);
  }, [celebrationAudio]);

  const today = useMemo(() => new Date(), []); 
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
  const [tasks, setTasks] = useState([
    { id: 1, title: 'COA – Pipelining', completed: true },
    { id: 2, title: 'OS – Deadlocks', completed: false },
    { id: 3, title: 'DBMS – Normal Forms', completed: false },
  ]);

  const [revisions, setRevisions] = useState([
    { id: 101, title: 'COA – Cache Memory', time: '1-day', completed: false },
    { id: 102, title: 'OS – Scheduling', time: '3-day', completed: false },
  ]);

  const firstDay = (new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

  return (
    <div className="min-h-screen w-full bg-[#050614] text-[#a0a5b8] font-sans flex overflow-hidden select-none">
      <Confetti pieces={confettiPieces} />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none animate-pulse duration-[10s]" />
      
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} navItems={NAV_ITEMS} />
      
      <main className="flex-1 h-screen overflow-y-auto flex flex-col z-10 scroll-smooth">
        <header className="w-full bg-[#0d0f22]/40 border-b border-white/5 backdrop-blur-md px-10 py-5 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <Menu size={22} className="cursor-pointer text-slate-400 hover:text-white" onClick={() => setIsExpanded(!isExpanded)} />
            <span className="text-xs italic text-slate-500 tracking-wide animate-pulse">Stay consistent today</span>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Flame size={18} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Streak: 10</span>
            </div>
            <button className="bg-white/5 p-2 rounded-full border border-white/10"><Moon size={18} /></button>
          </div>
        </header>

        <div className="p-8 md:p-12 flex flex-col items-center max-w-[1400px] mx-auto w-full animate-in fade-in duration-700">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full mb-12">
            <div className="xl:col-span-8 space-y-8">
              <TaskSection 
                tasks={tasks} 
                toggleTask={(id) => {
                  const t = tasks.find(x => x.id === id);
                  if(!t.completed) triggerCelebration();
                  setTasks(prev => prev.map(x => x.id === id ? {...x, completed: !x.completed} : x));
                }} 
                completedCount={tasks.filter(x => x.completed).length} 
                progressPercent={(tasks.filter(x => x.completed).length / tasks.length) * 100} 
              />
              <RevisionSection 
                revisions={revisions} 
                toggleRevision={(id) => {
                  const r = revisions.find(x => x.id === id);
                  if(!r.completed) triggerCelebration();
                  setRevisions(prev => prev.map(x => x.id === id ? {...x, completed: !x.completed} : x));
                }} 
              />
            </div>
            
            <MiniCalendar 
                viewDate={viewDate} 
                setViewDate={setViewDate} 
                today={today} 
                firstDay={firstDay} 
                daysInMonth={daysInMonth} 
            />
          </div>
          
          <section className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden self-center transition-all hover:bg-white/10 hover:scale-[1.02] duration-500 group text-center">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Brain size={60} className="text-blue-400" /></div>
             <p className="text-lg italic text-slate-200 font-medium leading-relaxed group-hover:text-white transition-colors">"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
             <div className="flex items-center justify-center space-x-3 mt-4">
                <div className="h-px w-8 bg-blue-500 transition-all group-hover:w-12"></div>
                <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">Winston Churchill</span>
                <div className="h-px w-8 bg-blue-500 transition-all group-hover:w-12"></div>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;