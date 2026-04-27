import ClientLayout from "@/components/client/layout/ClientLayout";
import TrackingGrid from "@/components/client/dashboard/trackings/TrackingGrid";
import UserProfileCard from "@/components/client/dashboard/UserProfile";
import GoalProgress from "@/components/client/dashboard/charts/GoalProgress";
import MonthlyProgress from "@/components/client/dashboard/charts/MonthlyProgress";
import { Flame, Zap, Clock, CheckCircle, Play, Dumbbell } from "lucide-react";
import { Spinner } from "@/components/common/Spinner";
import { useClientProfile } from "@/hooks/client/dashboard/useClientProfile";
import { useDailySummary } from "@/hooks/client/nutrition/useMeals";
import { useRecentWorkoutSessions } from "@/hooks/client/workout/useWorkout";
import { Link } from "react-router-dom";


const cmToFeetInches = (cm) => {
  if (!cm) return { feet: 0, inches: 0 };
  const totalInches = cm / 2.54;
  return { feet: Math.floor(totalInches / 12), inches: Math.round(totalInches % 12) };
};

const calculateAge = (dobString) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  return age > 0 ? age : null;
};

const getTodayISO = () => new Date().toISOString().split("T")[0];

const formatDuration = (seconds) => {
  if (!seconds) return "0 min";
  const mins = Math.floor(seconds / 60);
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ROW_ACCENTS = [
  { bg: "bg-purple-50", text: "text-purple-700" },
  { bg: "bg-teal-50",   text: "text-teal-700"   },
  { bg: "bg-amber-50",  text: "text-amber-700"  },
  { bg: "bg-pink-50",   text: "text-pink-700"   },
  { bg: "bg-blue-50",   text: "text-blue-700"   },
];

const SESSION_EMOJIS = ["🏋️", "🧘", "🏃", "🤸", "🚴"];


const GOAL_CONFIG = {
  weight_loss:     { icon: Flame, title: "Weight Loss",     color: "#ff6b35" },
  muscle_gain:     { icon: Zap,   title: "Muscle Gain",     color: "#06b6d4" },
  general_fitness: { icon: Zap,   title: "General Fitness", color: "#06b6d4" },
};

const deriveGoals = (profile) => {
  if (!profile) return [];
  const key    = profile.fitness_goal;
  const config = GOAL_CONFIG[key] ?? { icon: Zap, title: key ?? "Fitness", color: "#06b6d4" };
  const goalDisplayMap = {
    weight_loss: { goal: `${profile.weight_kg ?? 0} kg current`, percentage: 60 },
    muscle_gain: { goal: "70 kg / 80 kg",                        percentage: 79 },
  };
  const display = goalDisplayMap[key] ?? { goal: "In Progress", percentage: 0 };
  return [{ ...config, ...display }];
};


const MACRO_CONFIG = [
  { key: "total_calories", label: "Calories", unit: "kcal", color: "bg-orange-100 text-orange-700", bar: "bg-orange-400", max: 2000 },
  { key: "protein",        label: "Protein",  unit: "g",    color: "bg-blue-100 text-blue-700",     bar: "bg-blue-400",   max: 100  },
  { key: "carbs",          label: "Carbs",    unit: "g",    color: "bg-yellow-100 text-yellow-700", bar: "bg-yellow-400", max: 100  },
  { key: "fat",            label: "Fat",      unit: "g",    color: "bg-red-100 text-red-700",       bar: "bg-red-400",    max: 100  },
];

function TodayNutritionSummary({ dailySummary, isLoading, isError }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Today's Nutrition</h3>
        <span className="text-xs text-gray-400">
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-32"><Spinner /></div>
      )}

      {isError && !isLoading && (
        <p className="text-sm text-red-400 text-center py-8">Could not load nutrition data.</p>
      )}

      {!isLoading && !isError && (
        <div className="space-y-4">
          {MACRO_CONFIG.map(({ key, label, unit, color, bar, max }) => {
            const value = dailySummary?.[key] ?? 0;
            return (
              <div key={label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">{label}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
                    {Number(value).toFixed(1)} {unit}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${bar}`}
                    style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
          {!dailySummary && (
            <p className="text-sm text-gray-400 text-center pt-4">No meals logged today yet.</p>
          )}
        </div>
      )}
    </div>
  );
}


const QUICK_START_TIPS = [
  { emoji: "🔥", title: "Burn calories",  desc: "Even 20 min burns 200+ kcal"    },
  { emoji: "💪", title: "Build strength", desc: "3× per week is all it takes"    },
  { emoji: "😴", title: "Sleep better",   desc: "Exercise improves sleep quality" },
];

function NewUserEmptyState() {
  return (
    <div className="py-4">

      <div className="flex flex-col items-center text-center mb-7">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-3xl mb-4">
          🏁
        </div>
        <h4 className="text-base font-semibold text-gray-800 mb-1">
          Your fitness journey starts here
        </h4>
        <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
          Watch your first workout video and your progress will appear here automatically.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-7">
        {QUICK_START_TIPS.map(({ emoji, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100"
          >
            <span className="text-2xl mb-2">{emoji}</span>
            <p className="text-xs font-semibold text-gray-700 mb-1">{title}</p>
            <p className="text-xs text-gray-400 leading-snug">{desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          to="/workout_categories"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Play size={14} />
          Browse Workouts
        </Link>
      </div>
       
    </div>
  );
}

function RecentWorkoutSessions({ sessions = [], isLoading, isError }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
            <Dumbbell size={16} className="text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
        </div>
        {!isLoading && !isError && sessions.length > 0 && (
          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-36">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <p className="text-sm text-red-400 text-center py-8">
          Could not load workout history.
        </p>
      )}

      {!isLoading && !isError && sessions.length === 0 && <NewUserEmptyState />}

      {!isLoading && !isError && sessions.length > 0 && (
        <div className="space-y-2">
          {sessions.map((session, idx) => {
            const accent      = ROW_ACCENTS[idx % ROW_ACCENTS.length];
            const emoji       = SESSION_EMOJIS[idx % SESSION_EMOJIS.length];
            const isCompleted = session.status === "completed";

            return (
              <div
                key={session.id}
                className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${accent.bg}`}
                >
                  {session.category_image ? (
                    <img
                      src={session.category_image}
                      alt={session.category_name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span>{emoji}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${accent.text}`}>
                    {session.category_name ?? "Workout"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(session.started_at)}
                    {session.video_count > 0 &&
                      ` · ${session.video_count} video${session.video_count !== 1 ? "s" : ""}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs font-semibold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full">
                    🔥 {session.total_calories_burned} kcal
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                    <Clock size={11} />
                    {formatDuration(session.total_duration_seconds)}
                  </span>
                  {isCompleted && (
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function DashboardError({ message, onRetry }) {
  return (
    <ClientLayout>
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p className="text-red-500 text-center font-medium">
          {message || "Something went wrong. Please try again."}
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          Retry
        </button>
      </div>
    </ClientLayout>
  );
}

function DashboardLoading() {
  return (
    <ClientLayout>
      <div className="flex justify-center items-center h-64"><Spinner /></div>
    </ClientLayout>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientDashboard() {
  const today = getTodayISO();

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorData,
    refetch: refetchProfile,
  } = useClientProfile();
  console.log("profile:",profile)

  const {
    data: dailySummary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useDailySummary(today);

  const {
    data: recentSessions = [],
    isLoading: sessionsLoading,
    isError: sessionsError,
  } = useRecentWorkoutSessions();
  console.log("recentSessions:",recentSessions)

  // ── Derived display values ────────────────────────────────────────────────

  const { feet, inches } = cmToFeetInches(profile?.height_cm);
  const age   = calculateAge(profile?.date_of_birth);
  const goals = deriveGoals(profile);

  const userData = {
    name:   profile?.full_name ?? "User",
    weight: `${profile?.weight_kg ?? 0} kg`,
    height: `${feet} ft ${inches} in`,
    age:    `${age ?? 0} yrs`,
  };

  // ── Page-level guards ─────────────────────────────────────────────────────

  if (profileLoading) return <DashboardLoading />;

  if (profileError) {
    return (
      <DashboardError
        message={profileErrorData?.message ?? "Failed to load profile data."}
        onRetry={refetchProfile}
      />
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ClientLayout headerProps={{ userName: userData.name, location: "Dashboard" }}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ── Main content (3 cols) ── */}
        <div className="lg:col-span-3">

          <TrackingGrid
            profile={profile}
            dailySummary={dailySummary}
            isLoadingSummary={summaryLoading}
            hasSummaryError={summaryError}
            recentSessions={recentSessions}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div /> {/* reserved left column for future widget */}
            <TodayNutritionSummary
              dailySummary={dailySummary}
              isLoading={summaryLoading}
              isError={summaryError}
            />
          </div>

          <RecentWorkoutSessions
            sessions={recentSessions}
            isLoading={sessionsLoading}
            isError={sessionsError}
          />

        </div>

        {/* ── Right sidebar ── */}
        <div>
          <UserProfileCard
            weight={userData.weight}
            height={userData.height}
            age={userData.age}
            calories={profile?.target_daily_calories}
            water={profile?.water_goal_ml}
          />

          <div className="bg-white rounded-2xl p-6 shadow-sm mt-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Goals</h3>
            {goals.map((goal, idx) => (
              <GoalProgress
                key={idx}
                icon={goal.icon}
                title={goal.title}
                goal={goal.goal}
                percentage={goal.percentage}
                color={goal.color}
              />
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
            <MonthlyProgress percentage={profile?.monthly_progress ?? 0} />
          </div>
        </div>

      </div>
    </ClientLayout>
  );
}