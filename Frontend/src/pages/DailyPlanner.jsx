/**
 * FILE 5: src/pages/DailyPlanner.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * CREATE THIS NEW FILE
 * 
 * Daily Planner - Task-level execution
 * Shows: Today's task list with time estimates, priorities, and completion tracking
 * 
 * Purpose: Execute daily tasks, track time, mark complete
 * This is where the actual work happens!
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight, Plus, CheckCircle2, Clock, AlertCircle, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import Confetti from '../components/ui/Confetti';
import { useAuth } from '../context/authContext';
import { logout } from '../firebase/authService';
import { plannerService, mockPlannerData } from '../services/plannerService';

const SUBJECT_COLORS = {
  'Algorithms': 'text-blue-400',
  'Data Structures': 'text-cyan-400',
  'Operating Systems': 'text-violet-400',
  'DBMS': 'text-teal-400',
  'Computer Networks': 'text-orange-400',
  'General Aptitude': 'text-yellow-400',
  'default': 'text-slate-400',
};

const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  low: { label: 'Low', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
};

const DailyPlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('daily');
  
  const urlDate = searchParams.get('date');
  const [currentDate, setCurrentDate] = useState(urlDate ? new Date(urlDate) : new Date());
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    const data = mockPlannerData.getDailyTasks(currentDate);
    setTasks(data);
  }, [currentDate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleNavigate = (section) => {
    const routes = {
      dashboard: '/dashboard',
      revision: '/revision',
      yearly: '/yearly',
      monthly: '/monthly',
      weekly: '/weekly',
    };
    if (routes[section]) {
      navigate(routes[section]);
    } else {
      setActiveSection(section);
    }
  };

  const prevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const nextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const triggerCelebration = () => {
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: Math.random(),
      x: Math.random() * 100,
      color: ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'][i % 6],
      delay: Math.random() * 0.3,
      duration: 2 + Math.random() * 1.5,
    }));
    setConfettiPieces(prev => [...prev, ...pieces]);
    setTimeout(() => setConfettiPieces(prev => prev.filter(p => !pieces.includes(p))), 4000);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (!t.done) triggerCelebration();
      return { ...t, done: !t.done };
    }));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      done: false,
    };
    setTasks(prev => [...prev, newTask]);
    setShowAddModal(false);
  };

  const completedCount = tasks.filter(t => t.done).length;
  const totalMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const completedMinutes = tasks.filter(t => t.done).reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const isToday = currentDate.toDateString() === new Date().toDateString();
  const dateLabel = currentDate.toLocaleDateString('en-IN', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen w-full bg-[#060914] text-slate-300 flex overflow-hidden">
      <Confetti pieces={confettiPieces} />
      
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

      <main className="flex-1 h-screen overflow-y-auto flex flex-col">
        
        <header className="sticky top-0 z-20 bg-[#060914]/90 backdrop-blur-xl
          border-b border-white/[0.05] px-6 md:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsExpanded(v => !v)}
              className="text-slate-500 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-black text-white leading-tight flex items-center gap-2">
                <CalendarIcon size={18} className="text-emerald-400" />
                Daily Planner
              </h1>
              <p className="text-[11px] text-slate-600">Execute tasks and track your progress</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={goToToday}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300
                px-3 py-1.5 rounded-lg hover:bg-blue-500/10 border border-blue-500/20
                transition-all duration-200">
              Today
            </button>

            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06]
              px-3 py-1.5 rounded-lg">
              <button onClick={prevDay}
                className="text-slate-500 hover:text-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-white min-w-[100px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <button onClick={nextDay}
                className="text-slate-500 hover:text-white transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>

            <button onClick={handleLogout}
              className="text-xs font-semibold text-slate-500 hover:text-red-400
                px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent
                hover:border-red-500/20 transition-all duration-200">
              Sign out
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-[1000px] mx-auto">
            
            {/* Date & Stats */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">{dateLabel}</h2>
                  {isToday && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs font-medium text-blue-400">Today</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold
                    hover:bg-blue-600 transition-all duration-200 flex items-center gap-2
                    shadow-lg shadow-blue-500/30">
                  <Plus size={16} />
                  Add Task
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-xs text-slate-500 font-medium">Completed</span>
                  </div>
                  <div className="text-2xl font-black text-white">
                    {completedCount}/{tasks.length}
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-blue-400" />
                    <span className="text-xs text-slate-500 font-medium">Total Time</span>
                  </div>
                  <div className="text-2xl font-black text-white">
                    {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-yellow-400" />
                    <span className="text-xs text-slate-500 font-medium">Progress</span>
                  </div>
                  <div className="text-2xl font-black text-white">{progressPct}%</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out
                    bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500
                    shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-slate-600">{completedMinutes} min completed</span>
                <span className="text-slate-600">{totalMinutes - completedMinutes} min remaining</span>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {tasks.map((task, i) => {
                const subjectColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.default;
                const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

                return (
                  <div
                    key={task.id}
                    style={{ animationDelay: `${i * 50}ms` }}
                    className={`group bg-[#0a0f1e]/60 border rounded-xl p-4
                      backdrop-blur-sm transition-all duration-200 animate-in fade-in slide-in-from-left-1
                      ${task.done
                        ? 'border-white/[0.03] opacity-50'
                        : 'border-white/[0.06] hover:border-white/[0.09] hover:bg-[#0a0f1e]/80'
                      }`}>
                    
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0
                          transition-all duration-200
                          ${task.done
                            ? 'bg-emerald-500 border-emerald-500 scale-95'
                            : 'border-slate-600 hover:border-blue-500 hover:scale-105'
                          }`}>
                        {task.done && <CheckCircle2 size={16} strokeWidth={3} className="text-white" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className={`text-sm font-semibold transition-all duration-200
                            ${task.done ? 'line-through text-slate-600' : 'text-slate-200 group-hover:text-white'}`}>
                            {task.title}
                          </h3>
                          
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400
                              transition-all duration-200 shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`text-xs font-bold ${subjectColor}`}>
                            {task.subject}
                          </span>

                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md
                            ${priorityConfig.bg} border ${priorityConfig.border}`}>
                            <AlertCircle size={12} className={priorityConfig.color} />
                            <span className={`text-[10px] font-bold ${priorityConfig.color}`}>
                              {priorityConfig.label}
                            </span>
                          </div>

                          {task.estimatedMinutes && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Clock size={12} />
                              <span className="text-[11px] font-medium">
                                {task.estimatedMinutes} min
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {tasks.length === 0 && (
                <div className="text-center py-16 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                  <CalendarIcon size={40} className="mx-auto mb-3 text-slate-700" />
                  <p className="text-sm font-medium text-slate-500 mb-2">No tasks for this day</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold
                      transition-colors">
                    Add your first task
                  </button>
                </div>
              )}

              {progressPct === 100 && tasks.length > 0 && (
                <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10
                  border border-emerald-500/30 text-center animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-lg font-bold text-emerald-400 mb-1">All tasks completed!</p>
                  <p className="text-sm text-slate-500">Great work today — keep the momentum going!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}>
          <div className="bg-[#0f1629] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Add New Task</h3>
            <form onSubmit={e => {
              e.preventDefault();
              addTask({
                subject: e.target.subject.value,
                title: e.target.title.value,
                estimatedMinutes: parseInt(e.target.minutes.value) || 0,
                priority: e.target.priority.value,
              });
              e.target.reset();
            }}>
              <div className="space-y-3">
                <select
                  name="subject"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1]
                    text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                    transition-all duration-200">
                  <option value="">Select subject</option>
                  {Object.keys(SUBJECT_COLORS).filter(s => s !== 'default').map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>

                <input
                  name="title"
                  type="text"
                  placeholder="Task title..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1]
                    text-slate-200 placeholder-slate-600 outline-none
                    focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                    transition-all duration-200"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="minutes"
                    type="number"
                    placeholder="Minutes"
                    min="1"
                    className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1]
                      text-slate-200 placeholder-slate-600 outline-none
                      focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                      transition-all duration-200"
                  />

                  <select
                    name="priority"
                    required
                    className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1]
                      text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                      transition-all duration-200">
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-4 rounded-lg bg-white/[0.05] text-slate-400
                    border border-white/[0.1] hover:bg-white/[0.08] font-medium
                    transition-all duration-200">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-lg bg-blue-500 text-white font-bold
                    hover:bg-blue-600 transition-all duration-200">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyPlanner;