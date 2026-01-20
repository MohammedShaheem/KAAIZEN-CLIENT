"use client"

/**
 * UserProfileCard - Displays user stats (Weight, Height, Age)
 * Used in dashboard right sidebar
 */
const UserProfileCard = ({ weight, height, age, goals = [] }) => {
  return (
    <div className="sticky top-8">
      {/* Stats Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{weight}</p>
            <p className="text-sm text-gray-500">Weight</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{height}</p>
            <p className="text-sm text-gray-500">Height</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{age}</p>
            <p className="text-sm text-gray-500">Age</p>
          </div>
        </div>

        {/* Goals Section */}
        {goals && goals.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Your Goals</h3>
            <div className="space-y-4">
              {goals.map((goal, idx) => (
                <div key={idx}>{goal}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfileCard
