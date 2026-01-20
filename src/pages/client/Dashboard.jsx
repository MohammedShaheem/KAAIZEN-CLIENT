import { useState, useEffect } from "react";
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
import { getDailySummary } from "@/services/client/meals";
import { useClientProfile } from "@/hooks/client/profile/useClientProfile";

export default function ClientDashboard() {
 
  const {
    data: profile,
    isLoading: loading,
    error,
  } = useClientProfile();

  
  const [favoriteWorkouts, setFavoriteWorkouts] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [dietItems, setDietItems] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);

  const cm = profile?.height_cm || 0;
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

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

  
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const summary = await getDailySummary(today);
        setDailySummary(summary);
      } catch (err) {
        console.error("Failed to fetch daily summary", err);
      }
    };

    fetchSummary();
  }, []);

  
  const deriveGoals = (fitnessGoal) => {
    const goalMap = {
      weight_loss: {
        icon: Flame,
        title: "Weight Loss",
        goal: `${profile?.weight_kg || 0}kg / 100kg`,
        percentage: 60,
        color: "#ff6b35",
      },
      muscle_gain: {
        icon: Zap,
        title: "Muscle Gain",
        goal: "70kg / 80kg",
        percentage: 79,
        color: "#06b6d4",
      },
      default: {
        icon: Zap,
        title: fitnessGoal || "General Fitness",
        goal: "0 / 100",
        percentage: 0,
        color: "#06b6d4",
      },
    };

    return [goalMap[fitnessGoal] || goalMap.default];
  };

  const goals = profile ? deriveGoals(profile.fitness_goal) : [];

  
  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">
            <Spinner/>
          </div>
        </div>
      </ClientLayout>
    );
  }

  
  if (error) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-center">
            <p>Error: {error.message || "Failed to load dashboard data"}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  
  const userData = {
    name: profile?.full_name || "User",
    weight: `${profile?.weight_kg || 0} kg`,
    height: `${feet} ft ${inches} in`,
    age: `${calculateAge(profile?.date_of_birth) || 0} yrs`,
  };

  return (
    <ClientLayout
      theme = "black"
      headerProps={{
        userName: userData?.name || "Client",
        location: "Meal Tracking",
        // userImage: user?.profile_image,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content - 3 columns */}
        <div className="lg:col-span-3">
          <TrackingGrid
            profile={profile}
            dailySummary={dailySummary}
          />

          {/* Workouts and Diet Menu */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <WorkoutSection
                title="Favorite Workouts"
                workouts={favoriteWorkouts}
              />
              <WorkoutSection
                title="Recent Workouts"
                workouts={recentWorkouts}
              />
            </div>

            <FeaturedDietMenu
              mealTime="Breakfast"
              time="10:00 am"
              items={dietItems}
              profile={profile}
            />
          </div>

          <WorkoutHistory workouts={workoutHistory} />
        </div>

        {/* Right Sidebar */}
        <div>
          <UserProfileCard
            weight={userData.weight}
            height={userData.height}
            age={userData.age}
            calories={profile?.target_daily_calories}
            water={profile?.water_goal_ml}
          />

          {/* Goals */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mt-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Goals
            </h3>
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
            <MonthlyProgress
              percentage={profile?.monthly_progress || 80}
            />
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
