/**
 * FILE 4: src/pages/WeeklyPlanner.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * CREATE THIS NEW FILE
 * 
 * Weekly Planner - Daily topic assignments
 * Shows: 7 days × Topics grid
 * 
 * Purpose: Assign specific topics to specific days of the week
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { useAuth } from '../context/authContext';
import { logout } from '../firebase/authService';
import { plannerService, mockPlannerData } from '../services/plannerService';

const SUBJECT_COLORS = {
  'Algorithms': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', accent: 'bg-blue-500' },
  'Operating Systems': { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', accent: 'bg-violet-500' },
  'DBMS': { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', accent: 'bg-cyan-500' },
  'Computer Networks': { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', accent: 'bg-orange-500' },
  'General Aptitude': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', accent: 'bg-yellow-500' },
  'Revision': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', accent: 'bg-emerald-500' },
};

const WeeklyPlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('weekly');
  
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [weekData, setWeekData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // Get week start (Monday)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  useEffect(() => {
    const data = mockPlannerData.getWeeklyData();
    setWeekData(data);
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
      daily: '/daily',
    };
    if (routes[section]) {
      navigate(routes[section]);
    } else {
      setActiveSection(section);
    }
  };

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const openAddModal = (day) => {
    setSelectedDay(day);
    setShowAddModal(true);
  };

  const addTopic = (subject, topic) => {
    if (!selectedDay || !subject || !topic.trim()) return;
    const dayKey = selectedDay.toLocaleDateString('en-US', { weekday: 'short' });
    setWeekData(prev => ({
      ...prev,
      [dayKey]: [
        ...(prev[dayKey] || []),
        { 
          subject, 
          topic, 
          color: Object.keys(SUBJECT_COLORS).find(s => s === subject) ? subject : 'Algorithms'
        },
      ],
    }));
    setShowAddModal(false);
    setSelectedDay(null);
  };

  const goToDailyPlanner = (date) => {
    navigate(`/daily?date=${date.toISOString().split('T')[0]}`);
  };

  const weekRange = `${weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${weekDays[6].toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <div className="min-h-screen w-full bg-[#060914] text-slate-300 flex overflow-hidden">
      
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
                <CalendarIcon size={18} className="text-violet-400" />
                Weekly Planner
              </h1>
              <p className="text-[11px] text-slate-600">Plan your week day by day</p>
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
              <button onClick={prevWeek}
                className="text-slate-500 hover:text-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-white min-w-[140px] text-center">
                {weekRange}
              </span>
              <button onClick={nextWeek}
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
          <div className="max-w-[1600px] mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {weekDays.map((date, i) => {
                const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
                const topics = weekData[dayKey] || [];
                const isToday = date.toDateString() === new Date().toDateString();
                const isPast = date < new Date() && !isToday;

                return (
                  <div key={i}
                    className={`bg-[#0a0f1e]/60 border rounded-2xl overflow-hidden
                      backdrop-blur-sm transition-all duration-300 flex flex-col
                      ${isToday ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' : 'border-white/[0.06] hover:border-white/[0.09]'}
                      ${isPast ? 'opacity-60' : ''}`}>
                    
                    {/* Day Header */}
                    <div className={`px-4 py-3 border-b flex items-center justify-between
                      ${isToday ? 'bg-blue-500/10 border-blue-500/20' : 'border-white/[0.05]'}`}>
                      <div>
                        <div className={`text-xs font-black uppercase tracking-wider
                          ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>
                          {dayKey}
                        </div>
                        <div className={`text-lg font-black leading-none mt-1
                          ${isToday ? 'text-white' : 'text-slate-300'}`}>
                          {date.getDate()}
                        </div>
                      </div>
                      {isToday && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>

                    {/* Topics */}
                    <div className="flex-1 p-3 space-y-2 min-h-[200px]">
                      {topics.map((item, idx) => {
                        const colors = SUBJECT_COLORS[item.subject] || SUBJECT_COLORS['Algorithms'];
                        return (
                          <div key={idx}
                            className={`p-3 rounded-xl border ${colors.bg} ${colors.border}
                              hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}>
                            <div className={`flex items-center gap-2 mb-1`}>
                              <div className={`w-1 h-4 rounded-full ${colors.accent}`} />
                              <span className={`text-xs font-bold ${colors.text}`}>
                                {item.subject}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed pl-3">
                              {item.topic}
                            </p>
                          </div>
                        );
                      })}

                      {topics.length === 0 && (
                        <div className="flex items-center justify-center h-full text-slate-600">
                          <p className="text-xs italic">No topics</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-3 pb-3 flex gap-2">
                      <button
                        onClick={() => openAddModal(date)}
                        className="flex-1 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]
                          text-xs font-semibold text-slate-400 hover:text-blue-400
                          hover:bg-blue-500/10 hover:border-blue-500/30
                          transition-all duration-200 flex items-center justify-center gap-1.5">
                        <Plus size={14} />
                        Add
                      </button>
                      <button
                        onClick={() => goToDailyPlanner(date)}
                        className="py-2 px-3 rounded-lg bg-blue-500/10 border border-blue-500/30
                          text-xs font-semibold text-blue-400 hover:bg-blue-500/20
                          transition-all duration-200 flex items-center gap-1">
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Add Topic Modal */}
      {showAddModal && selectedDay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}>
          <div className="bg-[#0f1629] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">
              Add Topic
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {selectedDay.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <form onSubmit={e => {
              e.preventDefault();
              addTopic(e.target.subject.value, e.target.topic.value);
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
                  {Object.keys(SUBJECT_COLORS).map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <input
                  name="topic"
                  type="text"
                  placeholder="Enter topic name..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1]
                    text-slate-200 placeholder-slate-600 outline-none
                    focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                    transition-all duration-200"
                />
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
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanner;