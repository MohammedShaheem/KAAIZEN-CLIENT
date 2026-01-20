"use client"

const MonthlyProgress = ({ percentage = 80 }) => {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-6">Monthly Progress</h3>
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#ff9966"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500">
        You have achieved <span className="font-bold text-orange-500">{percentage}%</span> of your goal this month
      </p>
    </div>
  )
}

export default MonthlyProgress
