// import GlassCard from "./GlassCard";
// import ProgressBar from "../ui/ProgressBar";

// export default function TasksCard() {
//   return (
//     <GlassCard title="Today's Tasks">
//       <div className="space-y-4">

//         <Task title="COA – Pipelining" time="1h" done />
//         <Task title="OS – Deadlocks" time="45m" />
//         <Task title="DBMS – Normal Forms" time="45m" />

//         <div className="pt-4">
//           <p className="text-sm text-white/60 mb-2">
//             Progress: 1 / 3
//           </p>
//           <ProgressBar value={33} />
//         </div>

//       </div>
//     </GlassCard>
//   );
// }

// function Task({ title, time, done }) {
//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <div
//           className={`h-4 w-4 rounded border flex items-center justify-center
//             ${done
//               ? "bg-emerald-500/20 border-emerald-400"
//               : "border-white/30"
//             }`}
//         >
//           {done && <span className="text-xs text-emerald-300">✓</span>}
//         </div>

//         <span className="text-sm text-white/80">
//           {title}
//         </span>
//       </div>

//       <span className="text-sm text-white/50">
//         {time}
//       </span>
//     </div>
//   );
// }


import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Trash2, Edit3, Clock } from 'lucide-react';

const TasksCard = ({ task, onToggle, onDelete }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 
        ${task.done 
          ? 'bg-white/[0.02] border-white/[0.03] opacity-60' 
          : 'bg-[#1a1d2b] border-white/5 hover:border-indigo-500/30 shadow-xl'}`}
    >
      {/* Animated Checkbox */}
      <button 
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
          ${task.done ? 'bg-emerald-500 border-emerald-500 scale-90' : 'border-slate-600 hover:border-indigo-400'}`}
      >
        {task.done && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 size={14} className="text-white" strokeWidth={3} />
          </motion.div>
        )}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate transition-all duration-300
          ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 
            ${task.done ? 'text-slate-600' : 'text-indigo-400'}`}>
            {task.subject}
          </span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <Clock size={10} /> {task.time || '1h'}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Edit3 size={14} />
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default TasksCard;