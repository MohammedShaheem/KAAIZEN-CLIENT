"use client"

import StatCard from "@/components/dashboard/StatCard"

/**
 * StatsBar - Horizontal bar displaying key statistics
 * Uses StatCard component for individual stats
 */
const StatsBar = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-3 gap-8 mb-8 py-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} value={stat.value} label={stat.label} />
      ))}
    </div>
  )
}

export default StatsBar
