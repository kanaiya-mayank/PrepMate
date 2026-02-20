/**
 * 1. ENHANCED MonthlyPlanner.jsx - BEAUTIFUL CARD UI
 * ═══════════════════════════════════════════════════════════════════════════
 * REPLACE: src/pages/MonthlyPlanner.jsx
 * 
 * Features:
 * - Beautiful card-based design with gradients
 * - Edit topics inline
 * - Smooth animations
 * - Visual week progress indicators
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight, Plus, X, Edit2, Check, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
//import { useAuth } from '../context/authContext';
import { logout } from '../firebase/authService';
import { mockPlannerData } from '../services/plannerService';

const SUBJECT_COLORS = {
  'Algorithms': { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  'Operating Systems': { gradient: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
  'DBMS': { gradient: 'from-cyan-500 to-teal-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  'Computer Networks': { gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  'Data Structures': { gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  'Theory of Computation': { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MonthlyPlanner = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedSubjects] = useState(['Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks']);
  const [weeklyTopics, setWeeklyTopics] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);

  useEffect(() => {
    function fun(){
      const data = {};
    selectedSubjects.forEach(subject => {
      data[subject] = mockPlannerData.getMonthlyData(subject, month);
    });
    setWeeklyTopics(data);
    }

    fun();
  }, [selectedSubjects, month]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err.message);
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

  const startEdit = (subject, week, topicIndex) => {
    const topic = weeklyTopics[subject][week][topicIndex];
    setEditingTopic({ subject, week, topicIndex, value: topic });
  };

  const saveEdit = () => {
    if (!editingTopic || !editingTopic.value.trim()) return;
    const { subject, week, topicIndex, value } = editingTopic;
    setWeeklyTopics(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [week]: prev[subject][week].map((t, i) => i === topicIndex ? value : t),
      },
    }));
    setEditingTopic(null);
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
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-blue-600/4 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] rounded-full bg-violet-600/4 blur-[120px]" />
      </div>

      <Sidebar />

      <main className="flex-1 h-screen overflow-y-auto flex flex-col">
        
        <header className="sticky top-0 z-20 bg-[#060914]/90 backdrop-blur-xl border-b border-white/[0.05] px-6 md:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-black text-white leading-tight">📅 Monthly Planner</h1>
              <p className="text-[11px] text-slate-600">Break down subjects into weekly topics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-lg">
              <button onClick={prevMonth} className="text-slate-500 hover:text-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-white min-w-[120px] text-center">
                {MONTHS[month]} {year}
              </span>
              <button onClick={nextMonth} className="text-slate-500 hover:text-white transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
            <button onClick={handleLogout} className="text-xs font-semibold text-slate-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200">
              Sign out
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            {selectedSubjects.map((subject, subjectIndex) => {
              const colors = SUBJECT_COLORS[subject] || SUBJECT_COLORS['Algorithms'];
              const topics = weeklyTopics[subject] || {};
              const totalTopics = Object.values(topics).flat().length;
              
              return (
                <div key={subject} className="bg-[#0a0f1e]/60 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-sm hover:border-white/[0.09] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${subjectIndex * 80}ms` }}>
                  
                  <div className={`px-6 py-4 bg-gradient-to-r ${colors.gradient} bg-opacity-10 border-b border-white/[0.08] flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg ${colors.glow}`}>
                        <span className="text-white font-black text-lg">{subject.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">{subject}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <TrendingUp size={12} />
                          {totalTopics} topics planned
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {[1,2,3,4].map(w => {
                        const count = (topics[`week${w}`] || []).length;
                        return (
                          <div key={w} className="text-center">
                            <div className={`w-10 h-10 rounded-xl ${count > 0 ? colors.bg : 'bg-white/[0.02]'} border ${count > 0 ? colors.border : 'border-white/[0.05]'} flex flex-col items-center justify-center transition-all duration-200`}>
                              <div className={`text-sm font-black ${count > 0 ? colors.text : 'text-slate-700'}`}>{count}</div>
                            </div>
                            <div className="text-[9px] text-slate-600 font-medium mt-1">Week {w}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['week1', 'week2', 'week3', 'week4'].map((week, i) => (
                      <div key={week} className="group bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/5">
                        
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.05]">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                              <span className={`text-sm font-black ${colors.text}`}>{i + 1}</span>
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Week {i + 1}</span>
                          </div>
                          <button onClick={() => openAddModal(subject, week)} className={`w-8 h-8 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} hover:scale-110 active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100`}>
                            <Plus size={16} strokeWidth={3} />
                          </button>
                        </div>

                        <div className="space-y-2 min-h-[100px]">
                          {(topics[week] || []).map((topic, idx) => (
                            <div key={idx}>
                              {editingTopic?.subject === subject && editingTopic?.week === week && editingTopic?.topicIndex === idx ? (
                                <div className="flex items-center gap-2">
                                  <input type="text" value={editingTopic.value} onChange={e => setEditingTopic({...editingTopic, value: e.target.value})} onKeyDown={e => e.key === 'Enter' && saveEdit()} className="flex-1 px-3 py-2 rounded-lg bg-white/[0.05] border border-blue-500/50 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30" autoFocus />
                                  <button onClick={saveEdit} className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors flex items-center justify-center">
                                    <Check size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="group/topic flex items-start gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.10] transition-all duration-200">
                                  <div className={`w-1.5 h-5 rounded-full bg-gradient-to-b ${colors.gradient} shrink-0 mt-0.5`} />
                                  <span className="flex-1 text-xs text-slate-300 leading-relaxed">{topic}</span>
                                  <div className="flex gap-1 opacity-0 group-hover/topic:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(subject, week, idx)} className="text-blue-400 hover:text-blue-300 transition-colors p-1">
                                      <Edit2 size={12} />
                                    </button>
                                    <button onClick={() => removeTopic(subject, week, idx)} className="text-red-400 hover:text-red-300 transition-colors p-1">
                                      <X size={12} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {(!topics[week] || topics[week].length === 0) && (
                            <div className="flex items-center justify-center h-24 text-slate-700">
                              <div className="text-center">
                                <Plus size={20} className="mx-auto mb-1 opacity-30" />
                                <p className="text-xs italic">No topics</p>
                              </div>
                            </div>
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
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#0f1629] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Add Topic</h3>
            <p className="text-sm text-slate-400 mb-4">{modalData?.subject} • Week {modalData?.week?.replace('week', '')}</p>
            <form onSubmit={e => {
              e.preventDefault();
              addTopic(e.target.topic.value);
              e.target.reset();
            }}>
              <input name="topic" type="text" placeholder="Enter topic name..." autoFocus className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200" />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 px-4 rounded-lg bg-white/[0.05] text-slate-400 border border-white/[0.1] hover:bg-white/[0.08] font-medium transition-all duration-200">Cancel</button>
                <button type="submit" className="flex-1 py-2 px-4 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/30">Add Topic</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyPlanner;