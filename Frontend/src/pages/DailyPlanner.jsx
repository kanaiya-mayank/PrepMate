import React, { useState, useMemo } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import TasksCard from '../cards/TasksCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Target, ListChecks } from 'lucide-react';

const DailyPlanner = () => {
  const [tasks, setTasks] = useState([
    { id: 1, subject: 'Algorithms', title: 'Solve 20 problems – Trees & Graphs', done: true, time: '2h 30m' },
    { id: 2, subject: 'Operating Systems', title: 'Read OS Chapter 4 – Memory Management', done: true, time: '1h 30m' },
    { id: 3, subject: 'DBMS', title: 'Practice Normalization exercises', done: false, time: '1h' },
  ]);

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.done).length;
    const total = tasks.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, percent };
  }, [tasks]);

  const handleToggle = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto min-h-screen text-slate-200">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
              Daily <span className="text-indigo-500 not-italic font-bold">Planner</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Focus on execution. One task at a time.</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
            <Plus size={18} strokeWidth={3} />
            Add New Task
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111421] border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Progress</p>
              <h2 className="text-3xl font-black text-white">{stats.percent}%</h2>
              <p className="text-[11px] text-emerald-400 font-bold uppercase">{stats.completed} of {stats.total} Tasks Done</p>
            </div>
            <div className="w-20 h-20 rounded-full border-8 border-white/5 flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="8" className="text-indigo-600" 
                  strokeDasharray="201.06" strokeDashoffset={201.06 - (201.06 * stats.percent) / 100} strokeLinecap="round" />
              </svg>
              <Target size={24} className="text-slate-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 p-6 rounded-[2.5rem] flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-orange-500/20 flex items-center justify-center">
              <Flame size={32} className="text-orange-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-black text-orange-500 uppercase tracking-widest">Current Streak</p>
              <h2 className="text-3xl font-black text-white">7 Days</h2>
              <p className="text-[11px] text-slate-500 font-medium">Keep going to reach your best (14d)</p>
            </div>
          </div>
        </div>

        {/* Task List Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ListChecks size={18} className="text-indigo-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Task Execution List</h3>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {tasks.map(task => (
                <TasksCard 
                  key={task.id} 
                  task={task} 
                  onToggle={handleToggle} 
                  onDelete={handleDelete} 
                />
              ))}
            </AnimatePresence>
          </div>

          {tasks.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
              <p className="text-slate-600 font-medium italic">Your planner is empty. Add a task to start your streak!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DailyPlanner;