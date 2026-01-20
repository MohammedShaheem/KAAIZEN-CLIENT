// src/components/client/dashboard/GoalsComponent.jsx
import { Camera, Plus } from "lucide-react";

const GoalsComponent = ({ dailySummary, targetCalories }) => {
  // Use dailySummary for dynamic %; fallback to 0%
  const summary = dailySummary?.summary || {};
  const macros = [
  {
    label: "Protein",
    value: `${summary.protein
      ? ((summary.protein / targetCalories) * 100).toFixed(0)
      : 0}%`,
  },
  {
    label: "Fats",
    value: `${summary.fat
      ? ((summary.fat / targetCalories) * 100).toFixed(0)
      : 0}%`,
  },
  {
    label: "Carbs",
    value: `${summary.carbs
      ? ((summary.carbs / targetCalories) * 100).toFixed(0)
      : 0}%`,
  },
  {
    label: "Fibre",
    value: `${summary.fiber
      ? ((summary.fiber / targetCalories) * 100).toFixed(0)
      : 0}%`,
  },
];

  return (
    <div className="bg-gradient-to-b from-orange-100 to-white rounded-lg p-4 shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-2">Today's Goals</h3>
      <div className="flex items-center justify-between py-2 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-xl">🍴</span> {/* Fork icon emoji */}
          </div>
          <div>
            <p className="font-semibold">Track Food</p>
            <p className="text-sm text-gray-600">Eat {targetCalories.toLocaleString()} Cal</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="text-orange-600"><Camera size={20} /></button>
          <button className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center text-orange-600">
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {macros.map((macro, idx) => (
          <div key={idx}>
            <p className="text-sm">{macro.label}: {macro.value}</p>
            <div className="h-1 bg-gray-200 rounded mt-1"></div> {/* Progress bar placeholder */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsComponent;