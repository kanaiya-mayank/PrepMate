import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { revisionService } from '../services/revisionService';
import { CheckCircle2, Clock, BarChart3, Target } from 'lucide-react';

const RevisionPage = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ overdue: 0, today: 0, completed: 0, total: 0 });

  const refresh = useCallback(() => {
    setData(revisionService.getDueRevisions(true)); 
    setStats(revisionService.getStats());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleToggle = (id) => {
    revisionService.toggleStatus(id);
    refresh();
  };

  const masteryPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <DashboardLayout activeSection="revision">
      <div className="p-6 md:p-8 max-w-6xl mx-auto text-slate-200">
        <header className="mb-10 text-left">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">PrepMate <span className="text-indigo-500 not-italic">Revision</span></h1>
          <p className="text-slate-500 text-sm mt-1">Spaced Repetition • Synced with Dashboard</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Overdue', val: stats.overdue, color: 'text-red-400', bg: 'bg-red-500/10', icon: Clock },
            { label: 'Today', val: stats.today, color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Target },
            { label: 'Completed', val: stats.completed, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
            { label: 'Mastery Score', val: `${masteryPct}%`, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: BarChart3 },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} border border-white/5 p-5 rounded-3xl transition-all hover:bg-white/5 group text-left`}>
              <s.icon size={16} className={`${s.color} mb-3 group-hover:scale-110 transition-transform`} />
              <p className="text-2xl font-black text-white leading-none">{s.val}</p>
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 text-left">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 mb-6 flex items-center gap-2"><span className="w-8 h-[1px] bg-indigo-500/50"></span> Revision Queue</h2>
          {data.map(rev => (
            <div key={rev.id} className={`flex items-center justify-between p-5 border rounded-3xl transition-all duration-300
              ${rev.completed ? 'bg-white/[0.01] border-white/5 opacity-40' : 'bg-white/[0.03] border-white/10 hover:border-indigo-500/30'}`}>
              <div className="flex items-center space-x-5">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black 
                  ${rev.completed ? 'bg-slate-500/10 text-slate-500' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                  <span className="text-[9px] uppercase leading-none opacity-50">Day</span>
                  <span className="text-xl leading-none mt-1">{rev.interval_day}</span>
                </div>
                <div>
                  <h4 className={`font-bold transition-all ${rev.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>{rev.topic_name}</h4>
                  <p className="text-[10px] font-bold uppercase text-slate-500 mt-1">{rev.subject} • {revisionService.formatRelativeDate(rev.scheduled_date)}</p>
                </div>
              </div>
              <button onClick={() => handleToggle(rev.id)} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all active:scale-90
                  ${rev.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 text-slate-600 hover:text-emerald-400'}`}><CheckCircle2 size={20} /></button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RevisionPage;