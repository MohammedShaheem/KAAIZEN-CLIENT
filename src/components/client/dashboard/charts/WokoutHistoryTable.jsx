"use client"

/**
 * WorkoutHistory - Table component showing workout history
 * Displays recent workout activities with details
 */
const WorkoutHistory = ({ workouts = [] }) => {
  return (
    <div className="bg-gray-200 rounded-2xl p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout History</h3>

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            {workouts.map((workout, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{workout.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{workout.category}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{workout.videosWatched}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{workout.caloriesBurned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-between items-center mt-4">
        <button className="p-2 hover:bg-gray-300 rounded-lg transition">←</button>
        <button className="p-2 hover:bg-gray-300 rounded-lg transition">→</button>
      </div>
    </div>
  )
}

export default WorkoutHistory
