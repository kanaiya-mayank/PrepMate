import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Flame, Target, ListChecks, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DAILY_TASKS = [
  { id: 1, subject: 'Algorithms', title: 'Solve 20 problems – Trees & Graphs', done: true, time: '2h 30m' },
  { id: 2, subject: 'Operating Systems', title: 'Read OS Chapter 4 – Memory Management', done: true, time: '1h 30m' },
  { id: 3, subject: 'DBMS', title: 'Practice Normalization exercises', done: false, time: '1h 00m' },
];

const DailyPlanner = () => {
  const [tasks, setTasks] = useState(MOCK_DAILY_TASKS);
  const [isExpanded, setIsExpanded] = useState(false);

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.done).length;
    return {
      completed,
      total: tasks.length,
      percent: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
    };
  }, [tasks]);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, done: !t.done } : t
    ));
  }, []);

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <DashboardLayout 
      isExpanded={isExpanded} 
      setIsExpanded={setIsExpanded} 
      activeSection="daily"
    >
      <div className="p-6 md:p-8 max-w-5xl mx-auto min-h-screen text-slate-200">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
              Daily <span className="text-blue-500 not-italic">Planner</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Focus on today's execution.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20 text-sm">
            <Plus size={18} strokeWidth={3} />
            Add Task
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#0a0f1e]/60 border border-white/[0.06] p-6 rounded-[2rem] flex items-center justify-between backdrop-blur-sm">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Daily Progress</p>
              <h2 className="text-3xl font-black text-white">{stats.percent}%</h2>
              <p className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-tight">
                {stats.completed} of {stats.total} Tasks Completed
              </p>
            </div>
            <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-blue-500" 
                        strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * stats.percent) / 100} strokeLinecap="round" />
                </svg>
                <Target size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 p-6 rounded-[2rem] flex items-center gap-5 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Flame size={28} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Consistency</p>
              <h2 className="text-3xl font-black text-white">7 Days</h2>
              <p className="text-xs text-slate-500 font-medium tracking-tight">Current Streak maintained 🔥</p>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ListChecks size={18} className="text-blue-400" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">Execution Queue</h3>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 
                    ${task.done 
                      ? 'bg-white/[0.02] border-white/[0.03] opacity-50' 
                      : 'bg-white/[0.04] border-white/[0.06] hover:border-blue-500/30'}`}
                >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                      ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-blue-500'}`}
                  >
                    {task.done && <CheckCircle2 size={14} className="text-white" strokeWidth={3} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate transition-all
                      ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">
                        {task.subject}
                      </span>
                      <span className="text-[10px] text-slate-600 flex items-center gap-1">
                        <Clock size={10} /> {task.time}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DailyPlanner;