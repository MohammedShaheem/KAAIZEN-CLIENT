import ClientLayout from "@/components/client/layout/ClientLayout";
import TrackingGrid from "@/components/client/dashboard/trackings/TrackingGrid";
import UserProfileCard from "@/components/client/dashboard/UserProfile";
import GoalProgress from "@/components/client/dashboard/charts/GoalProgress";
import WorkoutSection from "@/components/client/dashboard/WorkoutSection";
import FeaturedDietMenu from "@/components/client/dashboard/DietItem";
import MonthlyProgress from "@/components/client/dashboard/charts/MonthlyProgress";
import WorkoutHistory from "@/components/client/dashboard/charts/WokoutHistoryTable";
import { Flame, Zap } from "lucide-react";
import { Spinner } from "@/components/common/Spinner";
import { useClientProfile } from "@/hooks/client/dashboard/useClientProfile";
import { useDailySummary } from "@/hooks/client/nutrition/useMeals";


const cmToFeetInches = (cm) => {
  if (!cm) return { feet: 0, inches: 0 };
  const totalInches = cm / 2.54;
  return {
    feet: Math.floor(totalInches / 12),
    inches: Math.round(totalInches % 12),
  };
};

const calculateAge = (dobString) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age > 0 ? age : null;
};

const getTodayISO = () => new Date().toISOString().split("T")[0];

const GOAL_CONFIG = {
  weight_loss: { icon: Flame, title: "Weight Loss", color: "#ff6b35" },
  muscle_gain: { icon: Zap,   title: "Muscle Gain", color: "#06b6d4" },
  general_fitness: { icon: Zap, title: "General Fitness", color: "#06b6d4" },
};

const deriveGoals = (profile) => {
  if (!profile) return [];
  const key = profile.fitness_goal;
  const config = GOAL_CONFIG[key] ?? { icon: Zap, title: key ?? "Fitness", color: "#06b6d4" };
  const goalDisplayMap = {
    weight_loss: { goal: `${profile.weight_kg ?? 0} kg current`, percentage: 60 },
    muscle_gain: { goal: "70 kg / 80 kg", percentage: 79 },
  };
  const display = goalDisplayMap[key] ?? { goal: "In Progress", percentage: 0 };
  return [{ ...config, ...display }];
};

// ─── Today's Nutrition Summary Card ──────────────────────────────────────────

const MACRO_CONFIG = [
  { key: "total_calories", label: "Calories", unit: "kcal", color: "bg-orange-100 text-orange-600", bar: "bg-orange-400", max: 2000 },
  { key: "protein",        label: "Protein",  unit: "g",    color: "bg-blue-100 text-blue-600",   bar: "bg-blue-400",   max: 100  },
  { key: "carbs",          label: "Carbs",    unit: "g",    color: "bg-yellow-100 text-yellow-600", bar: "bg-yellow-400", max: 100 },
  { key: "fat",            label: "Fat",      unit: "g",    color: "bg-red-100 text-red-600",     bar: "bg-red-400",    max: 100  },
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
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <p className="text-sm text-red-400 text-center py-8">
          Could not load nutrition data.
        </p>
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
            <p className="text-sm text-gray-400 text-center pt-4">
              No meals logged today yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

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

// ─── Loading State ────────────────────────────────────────────────────────────

function DashboardLoading() {
  return (
    <ClientLayout>
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
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

  const {
    data: dailySummary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useDailySummary(today);

  // ── Derived display values ────────────────────────────────────────────────

  const { feet, inches } = cmToFeetInches(profile?.height_cm);
  const age = calculateAge(profile?.date_of_birth);
  const goals = deriveGoals(profile);

  const userData = {
    name:   profile?.full_name ?? "User",
    weight: `${profile?.weight_kg ?? 0} kg`,
    height: `${feet} ft ${inches} in`,
    age:    `${age ?? 0} yrs`,
  };

  // ── Guards ────────────────────────────────────────────────────────────────

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
    <ClientLayout
      headerProps={{
        userName: userData.name,
        location: "Dashboard",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ── Main Content (3 cols) ── */}
        <div className="lg:col-span-3">
          <TrackingGrid
            profile={profile}
            dailySummary={dailySummary}
            isLoadingSummary={summaryLoading}
            hasSummaryError={summaryError}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              
              {/* <WorkoutSection title="Favorite Workouts" workouts={[]} />
              <WorkoutSection title="Recent Workouts"   workouts={[]} /> */}
            </div>

            {/* Nutrition summary uses real data from useDailySummary */}
            <TodayNutritionSummary
              dailySummary={dailySummary}
              isLoading={summaryLoading}
              isError={summaryError}
            />
          </div>

          {/* TODO: Replace with useWorkoutHistory() hook */}
          <WorkoutHistory workouts={[]} />
        </div>

        {/* ── Right Sidebar ── */}
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
            {/* TODO: Replace with real monthly_progress once API supports it */}
            <MonthlyProgress percentage={profile?.monthly_progress ?? 0} />
          </div>
        </div>

      </div>
    </ClientLayout>
  );
}