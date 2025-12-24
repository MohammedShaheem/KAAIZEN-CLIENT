import { useEffect, useState } from "react"
import { useDispatch,useSelector } from "react-redux"
import { refreshSession } from "@/features/auth/authThunk"
import StatCard from "@/components/admin/ui/StatCard"
import Sidebar from "@/components/admin/ui/Sidebar"
import Header from "@/components/admin/ui/Header"

const fetchAdminDashboard = () =>
  Promise.resolve({
    data: {
      total_revenue: 200.0,
      total_users: 551,
      trainers: 551,
      total_category: 5,
      platform_commission: 200.0,
      active_users: 441,
      approved_verification: 100,
      pending_verification: 100,
    },
  })

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetchAdminDashboard().then((res) => setStats(res.data))
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#7B1FA2] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar userName="Edwin" />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Stats Grid - Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <StatCard title="Total Revenue" value={stats.total_revenue.toFixed(2)} prefix="$" />
            <StatCard title="Total Users" value={stats.total_users} />
            <StatCard title="Total Trainers" value={stats.trainers} />
            <StatCard title="Total Category" value={stats.total_category} />
          </div>

          {/* Stats Grid - Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Platform_commission_earned" value={stats.platform_commission.toFixed(2)} prefix="$" />
            <StatCard title="Active users last 30 days" value={stats.active_users} />
            <StatCard title="approved_verification" value={stats.approved_verification} />
            <StatCard title="pending verification" value={stats.pending_verification} />
          </div>

          {/* Chart Section */}
          
        </main>
      </div>
    </div>
  )
}
