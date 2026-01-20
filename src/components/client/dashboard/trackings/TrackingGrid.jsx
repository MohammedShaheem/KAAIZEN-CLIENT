import TrackingCard from "./TrackingCard";
import WaterTrackingCard from "./Water_tracking_card";
import { Moon, Flame } from "lucide-react";
import FoodTrackingCard from "./Food_Traking_Card";
import SleepTrackingCard from "./SleepTrackingCard";

/**
 * TrackingGrid - Grid of tracking cards (Water, Food, Sleep, Calories)
 * Displays key health metrics in colorful cards
 */
const TrackingGrid = ({ profile = null, dailySummary = null, data = {} }) => {
  // Derive water goal from profile (backend-computed water_goal_ml)
  const waterGoalMl = profile?.water_goal_ml || 0;

  // Conversion: Standard glass size for water intake (250ml per glass)
  const glassesPerGlass = 250;
  const waterGoalGlasses = Math.round(waterGoalMl / glassesPerGlass);

  const dynamicData = {
    ...data,
    water: {
      ...data.water,
      goalMl: waterGoalMl,
      goal: waterGoalGlasses,
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Water */}
      <WaterTrackingCard data={dynamicData} />

      {/* Food */}
      <FoodTrackingCard
        dailySummary={dailySummary}
        targetCalories={profile?.target_daily_calories}
      />

      {/* Sleep*/}
      <SleepTrackingCard
        sleepData={dynamicData.sleep}
        profile={profile}
      />

      {/* Calories */}
      <TrackingCard
        icon={Flame}
        title="Calories"
        description={
          dynamicData.calories?.description ||
          `Goal: ${profile?.target_daily_calories || 0} kcal`
        }
        bgColor="bg-gradient-to-br from-purple-400 to-purple-600"
        textColor="text-white"
      />
    </div>
  );
};

export default TrackingGrid;
