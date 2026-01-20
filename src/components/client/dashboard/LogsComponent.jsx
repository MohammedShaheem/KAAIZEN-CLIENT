// src/components/client/dashboard/LogsComponent.jsx
const LogsComponent = ({ mealEntries }) => {
  return (
    <div className="bg-gradient-to-b from-teal-100 to-white rounded-lg p-4 shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-2">Today's Logs</h3>
      {mealEntries.length === 0 ? (
        <p className="text-gray-600">No meals logged yet. Start tracking!</p>
      ) : (
        mealEntries.map((entry) => (
          <div key={entry.id} className="py-2 border-b last:border-b-0">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {entry.time_eaten} {/* Format as 09:30 AM */}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                🍴
              </div>
              <div>
                <p className="font-semibold capitalize">{entry.meal_type.replace("_", " ")}</p>
                <p className="text-xl font-bold">
                  {entry.total_calories} / {entry.target_calories || "N/A"} Cal Eaten {/* Assume target from allocations */}
                </p>
                <p className="text-sm text-gray-600">{entry.food_description}</p>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>👑 Premium</span> {/* Placeholder */}
            </div>
            <div className="flex gap-4 mt-2">
              {/* Macro icons; dynamic values */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">🥜</div>
                <p>{entry.protein_grams?.toFixed(1) || 0}g</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">💧</div>
                <p>{entry.fat_grams?.toFixed(1) || 0}g</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">🍞</div>
                <p>{entry.carbs_grams?.toFixed(1) || 0}g</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">🌿</div>
                <p>{entry.fiber_grams?.toFixed(1) || 0}g</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LogsComponent;