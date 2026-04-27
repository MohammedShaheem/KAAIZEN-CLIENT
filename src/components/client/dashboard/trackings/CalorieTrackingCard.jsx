import { Flame } from "lucide-react";

/**
 * CalorieTrackingCard
 * Props:
 *  - burnedCalories  : number  – calories burned so far today (from dailySummary or workout sessions)
 *  - dailyBurnGoal   : number  – profile.daily_calorie_burn_goal
 */
const CalorieTrackingCard = ({ burnedCalories = 0, dailyBurnGoal = 0 }) => {
  const pct = dailyBurnGoal > 0 ? Math.min((burnedCalories / dailyBurnGoal) * 100, 100) : 0;
  const remaining = Math.max(dailyBurnGoal - burnedCalories, 0);

  // Arc geometry
  const R = 28;
  const CIRC = 2 * Math.PI * R;
  const dash = (pct / 100) * CIRC;

  // Colour tint based on progress
  const progressColor =
    pct >= 100 ? "#22c55e" : pct >= 60 ? "#f97316" : "#fb923c";

  return (
    <div className="relative bg-gradient-to-br from-[#1a0a00] via-[#3b1200] to-[#5c1f00] rounded-2xl p-5 shadow-xl overflow-hidden text-white select-none">

      {/* ── Ambient glow blobs ─────────────────────────── */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-500 opacity-20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-4 w-28 h-28 bg-red-600 opacity-15 rounded-full blur-2xl pointer-events-none" />

      {/* ── Dot-grid texture ──────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* ── Header ───────────────────────────────────── */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
            <Flame size={16} className="text-orange-400" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-orange-100">
            Calories
          </span>
        </div>

        {/* Percentage badge */}
        <span
          className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
          style={{
            color: progressColor,
            borderColor: `${progressColor}55`,
            backgroundColor: `${progressColor}18`,
          }}
        >
          {Math.round(pct)}%
        </span>
      </div>

      {/* ── Arc + centre stat ────────────────────────── */}
      <div className="relative flex items-center justify-center mb-4">
        <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-lg">
          {/* Track */}
          <circle
            cx="40" cy="40" r={R}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          {/* Progress */}
          <circle
            cx="40" cy="40" r={R}
            fill="none"
            stroke={progressColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${CIRC}`}
            strokeDashoffset={CIRC * 0.25}   /* start at 12 o'clock */
            style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.4s ease" }}
          />
          {/* Inner flame icon */}
          <text x="40" y="46" textAnchor="middle" fontSize="22">🔥</text>
        </svg>
      </div>

      {/* ── Burned / Goal numbers ─────────────────────── */}
      <div className="relative text-center mb-4">
        <p className="text-2xl font-black tracking-tight leading-none text-white">
          {burnedCalories.toLocaleString()}
          <span className="text-sm font-medium text-orange-300/80 ml-1">kcal</span>
        </p>
        <p className="text-xs text-orange-200/60 mt-0.5">burned today</p>
      </div>

      {/* ── Progress bar ─────────────────────────────── */}
      <div className="relative">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, #f97316, ${progressColor})`,
            }}
          />
        </div>

        {/* Goal row */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-orange-200/50 font-medium">
            Goal: {dailyBurnGoal.toLocaleString()} kcal
          </span>
          <span className="text-[10px] font-semibold text-orange-300/80">
            {remaining > 0
              ? `${remaining.toLocaleString()} left`
              : "Goal reached! 🎉"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalorieTrackingCard;