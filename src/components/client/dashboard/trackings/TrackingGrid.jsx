import CalorieTrackingCard from "./CalorieTrackingCard";
import WaterTrackingCard from "./Water_tracking_card";
import FoodTrackingCard from "./Food_Traking_Card";
import SleepTrackingCard from "./SleepTrackingCard";

const getTodayISO = () => new Date().toISOString().split("T")[0];

const TrackingGrid = ({
  profile = null,
  dailySummary = null,
  data = {},
  recentSessions = [],         
}) => {
  const waterGoalMl      = profile?.water_goal_ml || 0;
  const glassesPerGlass  = 250;
  const waterGoalGlasses = Math.round(waterGoalMl / glassesPerGlass);

  
  const today = getTodayISO();
  const burnedCalories = recentSessions
    .filter((s) => s.started_at?.startsWith(today))
    .reduce((sum, s) => sum + (Number(s.total_calories_burned) || 0), 0);

  const dynamicData = {
    ...data,
    water: {
      ...data.water,
      goalMl: waterGoalMl,
      goal:   waterGoalGlasses,
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <WaterTrackingCard data={dynamicData} />

      <FoodTrackingCard
        dailySummary={dailySummary}
        targetCalories={profile?.target_daily_calories}
      />

      <SleepTrackingCard sleepData={dynamicData.sleep} profile={profile} />

      <CalorieTrackingCard
        burnedCalories={burnedCalories}
        dailyBurnGoal={profile?.daily_calorie_burn_goal ?? 0}
      />
    </div>
  );
};

export default TrackingGrid;