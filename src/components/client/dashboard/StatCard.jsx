"use client"

const StatCard = ({ value, label }) => {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  )
}

export default StatCard
