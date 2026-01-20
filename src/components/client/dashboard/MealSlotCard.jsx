import { Plus } from "lucide-react";

const MealSlotCard = ({ 
  mealType, 
  targetCalories, 
  currentCalories = 0, 
  loggedFoods = [], 
  onAddClick,
  motivationalText,
  emoji 
}) => {
  const displayName = mealType.replace("_", " ");

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold capitalize">{displayName}</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {currentCalories.toFixed(0)} of {targetCalories.toFixed(0)} Cal
          </span>
          <button
            onClick={() => onAddClick(mealType)}
            className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 text-center min-h-24 flex flex-col items-center justify-center">
        {loggedFoods.length > 0 ? (
          <div className="space-y-2 w-full">
            {loggedFoods.map((food, i) => (
              <p key={i} className="text-sm text-gray-700 truncate">
                {food}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            {motivationalText} {emoji && <span className="ml-2">{emoji}</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export default MealSlotCard;