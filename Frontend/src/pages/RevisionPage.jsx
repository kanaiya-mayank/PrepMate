/**
 * FILE 2: src/pages/RevisionPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * REPLACE YOUR EXISTING FILE WITH THIS
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, BookOpen, Clock, TrendingUp, Menu, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { useAuth } from '../context/authContext';
import { logout } from '../firebase/authService';
import { revisionService, mockRevisionData } from '../services/revisionService';

const SUBJECT_COLORS = {
  'Algorithms': 'from-blue-500 to-cyan-500',
  'Operating Systems': 'from-violet-500 to-purple-500',
  'DBMS': 'from-cyan-500 to-teal-500',
  'Computer Networks': 'from-orange-500 to-amber-500',
  'Theory of Computation': 'from-pink-500 to-rose-500',
  'default': 'from-slate-500 to-slate-600',
};

const RevisionCard = ({ revision, onComplete }) => {
  const urgency = revisionService.getUrgencyStatus(revision.scheduledDate);
  const relativeDate = revisionService.formatRelativeDate(revision.scheduledDate);
  const label = revisionService.getIntervalLabel(revision.intervalDays);

  return (
    <div className={`group flex items-center justify-between gap-4 p-4 rounded-xl
      border transition-all duration-200 hover:scale-[1.01]
      ${urgency === 'overdue'
        ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-blue-500/30'
      }`}>
      
      <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl
        border-2 shrink-0 transition-transform group-hover:scale-105
        ${revision.intervalDays === 1  ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' :
          revision.intervalDays === 3  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' :
          revision.intervalDays === 7  ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' :
                                         'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
        }`}>
        <span className="text-[9px] font-black uppercase tracking-tight opacity-70">Day</span>
        <span className="text-xl font-black leading-none">{revision.intervalDays}</span>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
          {revision.topicName}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          {revision.subject} · {label}
        </p>
        <p className={`text-xs mt-1 font-medium
          ${urgency === 'overdue' ? 'text-red-400' : 'text-slate-600'}`}>
          {urgency === 'overdue' ? `⚠️ ${relativeDate}` : `📅 ${relativeDate}`}
        </p>
      </div>

      <button
        onClick={() => onComplete(revision.id)}
        className="shrink-0 w-10 h-10 rounded-full border border-slate-700
          flex items-center justify-center text-slate-500
          hover:border-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400
          active:scale-90 transition-all duration-200"
        title="Mark as revised"
      >
        <CheckCircle2 size={18} />
      </button>
    </div>
  );
};

const StudyingTopicCard = ({ topic, onComplete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const gradient = SUBJECT_COLORS[topic.subject] || SUBJECT_COLORS.default;

  if (showConfirm) {
    return (
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <p className="text-sm font-medium text-slate-300 mb-3">
          Mark <span className="text-white font-bold">{topic.topicName}</span> as completed?
        </p>
        <p className="text-xs text-slate-600 mb-4">
          This will generate 4 spaced revisions (Day 1, 3, 7, 21) to maximize retention.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onComplete(topic.id)}
            className="flex-1 py-2 px-3 rounded-lg bg-emerald-500/10 text-emerald-400
              border border-emerald-500/30 hover:bg-emerald-500/20 font-semibold text-sm
              transition-all duration-200"
          >
            ✓ Yes, Complete
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 py-2 px-3 rounded-lg bg-white/[0.03] text-slate-400
              border border-white/[0.06] hover:bg-white/[0.05] font-medium text-sm
              transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between gap-4 p-4 rounded-xl
      bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]
      hover:border-blue-500/20 transition-all duration-200">
      
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient}
          flex items-center justify-center shrink-0 shadow-lg opacity-80`}>
          <BookOpen size={18} className="text-white" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-200 truncate">
            {topic.topicName}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{topic.subject}</p>
        </div>
      </div>

      <button
        onClick={() => setShowConfirm(true)}
        className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold
          bg-blue-500/10 text-blue-400 border border-blue-500/30
          hover:bg-blue-500/20 transition-all duration-200"
      >
        Mark Complete
      </button>
    </div>
  );
};

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5
    hover:bg-white/[0.05] transition-all duration-200">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
      <Icon size={18} />
    </div>
    <div className="text-2xl font-black text-white leading-none mb-1">{value}</div>
    <div className="text-xs font-medium text-slate-500">{label}</div>
  </div>
);

const RevisionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('revision');
  const [revisions, setRevisions] = useState([]);
  const [studyingTopics, setStudyingTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dueRevisions = mockRevisionData.getMockRevisions();
      const topics = mockRevisionData.getMockTopics().filter(t => t.status === 'STUDYING');
      setRevisions(dueRevisions);
      setStudyingTopics(topics);
    } catch (err) {
      console.error('[RevisionPage] Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevisionComplete = async (revisionId) => {
    setRevisions(prev => prev.filter(r => r.id !== revisionId));
  };

  const handleTopicComplete = async (topicId) => {
    setStudyingTopics(prev => prev.filter(t => t.id !== topicId));
    alert('✓ Topic completed! 4 spaced revisions have been scheduled.');
    fetchData();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleNavigate = (section) => {
    if (section === 'dashboard') {
      navigate('/dashboard');
    } else {
      setActiveSection(section);
    }
  };

  const overdueCount = revisions.filter(r => 
    revisionService.getUrgencyStatus(r.scheduledDate) === 'overdue'
  ).length;
  
  const dueTodayCount = revisions.filter(r => 
    revisionService.getUrgencyStatus(r.scheduledDate) === 'today'
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#060914]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent
            rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading revisions...</p>
        </div>
      </div>
    );
  }

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
          border-b border-white/[0.05] px-6 md:px-8 py-4
          flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsExpanded(v => !v)}
              className="text-slate-500 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-black text-white leading-tight">🔄 Revision Module</h1>
              <p className="text-[11px] text-slate-600">Spaced repetition for maximum retention</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="text-xs font-semibold text-slate-500 hover:text-red-400
              px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent
              hover:border-red-500/20 transition-all duration-200">
            Sign out
          </button>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Clock} value={overdueCount} label="Overdue" color="bg-red-500/10 text-red-400" />
            <StatCard icon={CheckCircle2} value={dueTodayCount} label="Due Today" color="bg-yellow-500/10 text-yellow-400" />
            <StatCard icon={BookOpen} value={studyingTopics.length} label="Currently Studying" color="bg-blue-500/10 text-blue-400" />
            <StatCard icon={TrendingUp} value={revisions.length} label="Total Due" color="bg-emerald-500/10 text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {overdueCount > 0 && (
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="text-red-400">⚠️ OVERDUE</span>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{overdueCount}</span>
                  </h2>
                  <div className="space-y-2">
                    {revisions
                      .filter(r => revisionService.getUrgencyStatus(r.scheduledDate) === 'overdue')
                      .map(rev => (<RevisionCard key={rev.id} revision={rev} onComplete={handleRevisionComplete} />))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>📅 DUE TODAY</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{dueTodayCount}</span>
                </h2>
                {dueTodayCount > 0 ? (
                  <div className="space-y-2">
                    {revisions
                      .filter(r => revisionService.getUrgencyStatus(r.scheduledDate) === 'today')
                      .map(rev => (<RevisionCard key={rev.id} revision={rev} onComplete={handleRevisionComplete} />))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/[0.02] border border-white/[0.05] rounded-xl text-slate-600">
                    <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">All caught up for today!</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider mb-3">🟡 CURRENTLY STUDYING</h2>
              {studyingTopics.length > 0 ? (
                <div className="space-y-3">
                  {studyingTopics.map(topic => (
                    <StudyingTopicCard key={topic.id} topic={topic} onComplete={handleTopicComplete} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white/[0.02] border border-white/[0.05] rounded-xl text-slate-600">
                  <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium mb-2">No active topics</p>
                  <p className="text-xs text-slate-700">Start studying a new topic from your Daily Planner</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevisionPage;  