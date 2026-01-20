"use client"

const GoalProgress = ({ icon: Icon, title, goal, percentage, color }) => {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f0f0f0" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={32} className={`text-${color.replace("#", "")}`} />
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{goal}</p>
        <p className="text-lg font-bold text-gray-900 mt-2">{percentage}%</p>
      </div>
    </div>
  )
}

export default GoalProgress
