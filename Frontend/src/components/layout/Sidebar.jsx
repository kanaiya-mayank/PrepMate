import React from 'react';
import { BookOpen } from 'lucide-react';

const Sidebar = ({ isExpanded, setIsExpanded, navItems }) => (
  <aside 
    onMouseEnter={() => setIsExpanded(true)}
    onMouseLeave={() => setIsExpanded(false)}
    className={`relative z-50 h-screen bg-[#0d0f22]/80 backdrop-blur-3xl border-r border-white/5 transition-all duration-300 flex flex-col ${isExpanded ? 'w-64 shadow-[10px_0_30px_rgba(0,0,0,0.5)]' : 'w-20'}`}
  >
    <div className="p-6 flex items-center gap-3">
      <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-transform hover:rotate-12">
        <BookOpen size={24} />
      </div>
      {isExpanded && <span className="text-white font-bold text-xl tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">PrepMate</span>}
    </div>

    <nav className="flex-1 px-4 space-y-1 pt-4 overflow-y-auto custom-scrollbar">
      {navItems.map((item, idx) => (
        <div key={idx} className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 group ${item.active ? 'bg-blue-600/10 text-white border-l-2 border-blue-500 rounded-l-none' : 'hover:bg-white/5 text-slate-400 hover:translate-x-1'}`}>
          <div className="min-w-[24px] transition-transform group-hover:scale-110">{item.icon}</div>
          {isExpanded && <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>}
        </div>
      ))}
    </nav>

    <div className="p-4 border-t border-white/5 flex justify-center">
      <div className={`transition-all duration-500 ${isExpanded ? 'w-full bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-3' : 'w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden hover:scale-110'}`}>
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aman" className={isExpanded ? "w-8 h-8 rounded-full" : "w-full h-full"} alt="user" />
        {isExpanded && <div className="flex flex-col overflow-hidden animate-in fade-in duration-500 text-left"><span className="text-white text-[11px] font-bold">Aman Sharma</span><span className="text-[9px] text-slate-500">aman@example.com</span></div>}
      </div>
    </div>
  </aside>
);

export default Sidebar;