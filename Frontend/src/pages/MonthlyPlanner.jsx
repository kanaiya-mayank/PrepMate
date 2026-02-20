/**
 * FILE 3: src/pages/MonthlyPlanner.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * CREATE THIS NEW FILE
 * 
 * Monthly Planner - Weekly topic breakdown per subject
 * Shows: 4 weeks × N subjects grid with topics
 * 
 * Purpose: Break down monthly subjects into weekly topics
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { useAuth } from '../context/authContext';
import { logout } from '../firebase/authService';
import { plannerService, mockPlannerData } from '../services/plannerService';

const SUBJECT_COLORS = {
  'Algorithms': 'from-blue-500 to-cyan-500',
  'Operating Systems': 'from-violet-500 to-purple-500',
  'DBMS': 'from-cyan-500 to-teal-500',
  'Computer Networks': 'from-orange-500 to-amber-500',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MonthlyPlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('monthly');
  
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedSubjects, setSelectedSubjects] = useState(['Algorithms', 'Operating Systems', 'DBMS']);
  const [weeklyTopics, setWeeklyTopics] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    // Load weekly topics for selected subjects
    const data = {};
    selectedSubjects.forEach(subject => {
      data[subject] = mockPlannerData.getMonthlyData(subject, month);
    });
    setWeeklyTopics(data);
  }, [selectedSubjects, month]);

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
      weekly: '/weekly',
      daily: '/daily',
    };
    if (routes[section]) {
      navigate(routes[section]);
    } else {
      setActiveSection(section);
    }
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const openAddModal = (subject, week) => {
    setModalData({ subject, week });
    setShowAddModal(true);
  };

  const addTopic = (topic) => {
    if (!modalData || !topic.trim()) return;
    const { subject, week } = modalData;
    setWeeklyTopics(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [week]: [...(prev[subject]?.[week] || []), topic],
      },
    }));
    setShowAddModal(false);
    setModalData(null);
  };

  const removeTopic = (subject, week, topicIndex) => {
    setWeeklyTopics(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [week]: prev[subject][week].filter((_, i) => i !== topicIndex),
      },
    }));
  };

  return (
    <div className="min-h-screen w-full bg-[#060914] text-slate-300 flex overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/3 w-[500px] h-[350px] rounded-full bg-blue-600/4 blur-[120px]" />
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
              <h1 className="text-base font-black text-white leading-tight">
                📅 Monthly Planner
              </h1>
              <p className="text-[11px] text-slate-600">Break down subjects into weekly topics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06]
              px-3 py-1.5 rounded-lg">
              <button onClick={prevMonth}
                className="text-slate-500 hover:text-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-white min-w-[120px] text-center">
                {MONTHS[month]} {year}
              </span>
              <button onClick={nextMonth}
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
          <div className="max-w-[1400px] mx-auto">
            
            <div className="grid grid-cols-1 gap-6">
              {selectedSubjects.map(subject => {
                const gradient = SUBJECT_COLORS[subject] || 'from-slate-500 to-slate-600';
                const topics = weeklyTopics[subject] || {};
                
                return (
                  <div key={subject}
                    className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl overflow-hidden
                      backdrop-blur-sm hover:border-white/[0.09] transition-all duration-300">
                    
                    <div className={`px-6 py-4 bg-gradient-to-r ${gradient} bg-opacity-10
                      border-b border-white/[0.05] flex items-center justify-between`}>
                      <h3 className="text-base font-black text-white">{subject}</h3>
                      <span className="text-xs text-slate-400 font-medium">4 weeks</span>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {['week1', 'week2', 'week3', 'week4'].map((week, i) => (
                        <div key={week}
                          className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4
                            hover:bg-white/[0.04] transition-all duration-200">
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                              Week {i + 1}
                            </span>
                            <button
                              onClick={() => openAddModal(subject, week)}
                              className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30
                                flex items-center justify-center text-blue-400 hover:bg-blue-500/20
                                transition-all duration-200">
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="space-y-2">
                            {(topics[week] || []).map((topic, idx) => (
                              <div key={idx}
                                className="group flex items-start gap-2 p-2 rounded-lg
                                  bg-white/[0.03] border border-white/[0.05]
                                  hover:bg-white/[0.06] transition-all duration-200">
                                <span className="flex-1 text-xs text-slate-300 leading-relaxed">
                                  {topic}
                                </span>
                                <button
                                  onClick={() => removeTopic(subject, week, idx)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity
                                    text-red-400 hover:text-red-300">
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                            
                            {(!topics[week] || topics[week].length === 0) && (
                              <p className="text-xs text-slate-600 italic text-center py-2">
                                No topics yet
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Add Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}>
          <div className="bg-[#0f1629] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full
            shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">
              Add Topic - {modalData?.subject} Week {modalData?.week?.replace('week', '')}
            </h3>
            <form onSubmit={e => {
              e.preventDefault();
              addTopic(e.target.topic.value);
              e.target.reset();
            }}>
              <input
                name="topic"
                type="text"
                placeholder="Enter topic name..."
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1]
                  text-slate-200 placeholder-slate-600 outline-none
                  focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                  transition-all duration-200"
              />
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

export default MonthlyPlanner;