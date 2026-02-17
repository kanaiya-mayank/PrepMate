import GlassCard from "./GlassCard";
import ProgressBar from "../ui/ProgressBar";

export default function TasksCard() {
  return (
    <GlassCard title="Today's Tasks">
      <div className="space-y-4">

        <Task title="COA – Pipelining" time="1h" done />
        <Task title="OS – Deadlocks" time="45m" />
        <Task title="DBMS – Normal Forms" time="45m" />

        <div className="pt-4">
          <p className="text-sm text-white/60 mb-2">
            Progress: 1 / 3
          </p>
          <ProgressBar value={33} />
        </div>

      </div>
    </GlassCard>
  );
}

function Task({ title, time, done }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`h-4 w-4 rounded border flex items-center justify-center
            ${done
              ? "bg-emerald-500/20 border-emerald-400"
              : "border-white/30"
            }`}
        >
          {done && <span className="text-xs text-emerald-300">✓</span>}
        </div>

        <span className="text-sm text-white/80">
          {title}
        </span>
      </div>

      <span className="text-sm text-white/50">
        {time}
      </span>
    </div>
  );
}
