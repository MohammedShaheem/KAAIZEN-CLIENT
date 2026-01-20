import { UtensilsCrossed } from "lucide-react";
import "../../../../assets/css/client_css/food_tracking_card.css";
import { useNavigate } from "react-router-dom";

const FoodTrackingCard = ({ dailySummary, targetCalories }) => {
  const navigate = useNavigate();

  const consumedCalories =
    dailySummary?.summary?.total_calories || 0;

  const calorieGoal = targetCalories || 2000;

  const fillPercentage = Math.min(
    (consumedCalories / calorieGoal) * 100,
    100
  );

  const handleCardClick = () => {
    navigate("/meals");
  };

  return (
    <div
      className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-6 text-white shadow-lg overflow-hidden relative cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-6 -mb-6"></div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Header */}
        <div className="flex items-center gap-2 w-full">
          <UtensilsCrossed className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Food Tracking</h3>
        </div>

        {/* Plate Visualization */}
        <div className="food-plate-container">
          <svg className="food-plate" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />

            <defs>
              <clipPath id="plateFill">
                <circle cx="50" cy="50" r="40" />
              </clipPath>
              <radialGradient id="foodGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(254,215,170,0.8)" />
                <stop offset="70%" stopColor="rgba(249,115,22,0.8)" />
                <stop offset="100%" stopColor="rgba(234,88,12,0.9)" />
              </radialGradient>
            </defs>

            <g clipPath="url(#plateFill)">
              {fillPercentage > 0 && (
                <path
                  d={`M 50 50 L 50 10 A 40 40 0 ${fillPercentage > 50 ? 1 : 0} 1
                    ${50 + 40 * Math.cos((fillPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
                    ${50 + 40 * Math.sin((fillPercentage / 100) * 2 * Math.PI - Math.PI / 2)}`}
                  fill="url(#foodGradient)"
                />
              )}
            </g>
          </svg>
        </div>

        {/* Stats */}
        <div className="text-center">
          <p className="text-sm opacity-90 mb-1">
            Goal: {calorieGoal.toLocaleString()} kcal
          </p>
          <p className="text-2xl font-bold">
            {consumedCalories} / {calorieGoal} kcal
          </p>
          <p className="text-xs opacity-75">
            {Math.round(fillPercentage)}% of daily goal
          </p>

          {fillPercentage >= 100 && (
            <p className="text-sm font-semibold mt-2 animate-pulse">
              🎉 Daily Goal Achieved!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodTrackingCard;
