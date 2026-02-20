/**
 * FILE 2: src/pages/YearlyPlanner.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * CREATE THIS NEW FILE
 * 
 * Yearly Planner - Gantt-style strategic view
 * Shows: Which subjects to study in which months
 * 
 * Purpose: High-level planning — student maps out entire year's subject coverage
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { useAuth } from '../context/authContext';
import { logout } from '../firebase/authService';
import { plannerService, mockPlannerData } from '../services/plannerService';

const SUBJECT_COLORS = {
  'Algorithms': 'bg-blue-500',
  'Data Structures': 'bg-cyan-500',
  'Operating Systems': 'bg-violet-500',
  'DBMS': 'bg-teal-500',
  'Computer Networks': 'bg-orange-500',
  'Theory of Computation': 'bg-pink-500',
  'Compiler Design': 'bg-purple-500',
  'Digital Logic': 'bg-indigo-500',
  'Computer Organization': 'bg-sky-500',
  'Programming': 'bg-emerald-500',
  'General Aptitude': 'bg-yellow-500',
  'Engineering Mathematics': 'bg-rose-500',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const YearlyPlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('yearly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [subjectMonths, setSubjectMonths] = useState({});
  const [subjects] = useState(plannerService.getSubjects());

  useEffect(() => {
    // Load data
    const data = mockPlannerData.getYearlyData();
    setSubjectMonths(data);
  }, [year]);

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
      monthly: '/monthly',
      weekly: '/weekly',
      daily: '/daily',
    };
    if (routes[section]) {
      navigate(routes[section]);
    } else {
      setActiveSection(section);
    }
  };

  const toggleMonth = (subject, month) => {
    setSubjectMonths(prev => {
      const current = prev[subject] || [];
      const updated = current.includes(month)
        ? current.filter(m => m !== month)
        : [...current, month].sort((a, b) => a - b);
      return { ...prev, [subject]: updated };
    });
  };

  const isMonthSelected = (subject, month) => {
    return (subjectMonths[subject] || []).includes(month);
  };

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
        
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#060914]/90 backdrop-blur-xl
          border-b border-white/[0.05] px-6 md:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsExpanded(v => !v)}
              className="text-slate-500 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-black text-white leading-tight flex items-center gap-2">
                <Calendar size={18} className="text-blue-400" />
                Yearly Planner
              </h1>
              <p className="text-[11px] text-slate-600">Strategic subject coverage planning</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06]
              px-3 py-1.5 rounded-lg">
              <button
                onClick={() => setYear(y => y - 1)}
                className="text-slate-500 hover:text-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-white min-w-[60px] text-center">{year}</span>
              <button
                onClick={() => setYear(y => y + 1)}
                className="text-slate-500 hover:text-white transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              className="text-xs font-semibold text-blue-400 hover:text-blue-300
                px-3 py-1.5 rounded-lg hover:bg-blue-500/10 border border-blue-500/20
                transition-all duration-200 flex items-center gap-1.5">
              <Download size={14} />
              Export
            </button>

            <button onClick={handleLogout}
              className="text-xs font-semibold text-slate-500 hover:text-red-400
                px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent
                hover:border-red-500/20 transition-all duration-200">
              Sign out
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8">
          
          {/* Info Card */}
          <div className="max-w-[1400px] mx-auto mb-6 bg-blue-500/5 border border-blue-500/20
            rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
              <Calendar size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                Plan your year-long subject coverage
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Click on months to assign subjects. Overlapping subjects are OK — many topics span multiple months.
              </p>
            </div>
          </div>

          {/* Gantt Chart */}
          <div className="max-w-[1400px] mx-auto bg-[#0a0f1e]/60 border border-white/[0.06]
            rounded-2xl p-6 backdrop-blur-sm overflow-x-auto">
            
            <div className="min-w-[900px]">
              {/* Month Headers */}
              <div className="grid grid-cols-[200px_repeat(12,1fr)] gap-2 mb-4">
                <div className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Subjects
                </div>
                {MONTHS.map((month, i) => (
                  <div key={i}
                    className="text-center text-[10px] font-black uppercase tracking-wider text-slate-600">
                    {month}
                  </div>
                ))}
              </div>

              {/* Subject Rows */}
              <div className="space-y-3">
                {subjects.map((subject) => {
                  const color = SUBJECT_COLORS[subject] || 'bg-slate-500';
                  return (
                    <div key={subject}
                      className="grid grid-cols-[200px_repeat(12,1fr)] gap-2 items-center">
                      
                      {/* Subject Name */}
                      <div className="text-sm font-semibold text-slate-200 truncate">
                        {subject}
                      </div>

                      {/* Month Cells */}
                      {MONTHS.map((_, monthIndex) => {
                        const selected = isMonthSelected(subject, monthIndex);
                        return (
                          <button
                            key={monthIndex}
                            onClick={() => toggleMonth(subject, monthIndex)}
                            className={`h-10 rounded-lg border-2 transition-all duration-200
                              ${selected
                                ? `${color} border-transparent shadow-lg opacity-90 hover:opacity-100 hover:scale-105`
                                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]'
                              }`}
                            title={`${subject} - ${MONTHS[monthIndex]}`}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-[1400px] mx-auto mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <div className="text-xs text-slate-500 font-medium mb-1">Total Subjects</div>
              <div className="text-2xl font-black text-white">{subjects.length}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <div className="text-xs text-slate-500 font-medium mb-1">Subjects Planned</div>
              <div className="text-2xl font-black text-emerald-400">
                {Object.keys(subjectMonths).filter(s => subjectMonths[s].length > 0).length}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <div className="text-xs text-slate-500 font-medium mb-1">Coverage %</div>
              <div className="text-2xl font-black text-blue-400">
                {Math.round((Object.keys(subjectMonths).filter(s => subjectMonths[s].length > 0).length / subjects.length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default YearlyPlanner;