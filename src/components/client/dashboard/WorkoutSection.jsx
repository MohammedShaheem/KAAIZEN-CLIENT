"use client"

/**
 * WorkoutSection - Section for displaying favorite and recent workouts
 * Reusable component with customizable title and workout items
 */
const WorkoutSection = ({ title, workouts = [] }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workouts.map((workout, idx) => (
          <div key={idx} className="bg-gray-200 rounded-2xl overflow-hidden h-48">
            <img
              src={workout.image || "/placeholder.svg?height=200&width=300&query=workout"}
              alt={workout.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      {workouts.length > 0 && (
        <div className="flex gap-4 mt-4">
          <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">
            {workouts[0]?.actionLabel || "Start Training"}
          </button>
          {workouts[1]?.caloriesBurned && (
            <span className="text-orange-500 font-medium text-sm">{workouts[1]?.caloriesBurned} calories burned</span>
          )}
        </div>
      )}
    </div>
  )
}

export default WorkoutSection
