import React, { useState } from 'react'
import useLogout from '@/hooks/common/useLogout'
import { useTrainerProfile } from '@/hooks/trainer/useTrainerProfile'
import {
  Bell,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Eye,
  Medal,
  Activity,
  Lock
} from 'lucide-react'

export default function Dashboard() {
  const logout = useLogout()
  const { data: trainer, isLoading } = useTrainerProfile()
  const [notificationCount] = useState(3)

  if (isLoading) return null

  const isVerified = trainer?.is_verified === true

  const stats = {
    totalClients: 40689,
    monthlyEarning: 10293,
    weeklySessions: 89000,
    clientSatisfaction: 4.9,
    retentionRate: 94,
    scheduleUtilization: 46,
    activeToday: 5,
    inactiveClients: 3,
  }

  const upcomingSessions = [
    {
      id: 1,
      name: 'Emma Thomson',
      category: 'Yoga',
      date: 'Fri, Dec 15',
      time: '09:00 AM',
      avatar: '👩',
    },
    {
      id: 2,
      name: 'Emma Thomson',
      category: 'Yoga',
      date: 'Fri, Dec 15',
      time: '09:00 AM',
      avatar: '👩',
    },
  ]

  const activeClients = [
    { id: 1, avatar: '👩' },
    { id: 2, avatar: '👨' },
    { id: 3, avatar: '👩' },
    { id: 4, avatar: '👨' },
  ]

  const inactiveClients = [
    { id: 1, initials: 'DL' },
    { id: 2, initials: 'LG' },
  ]

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* ================= DASHBOARD CONTENT ================= */}
      <div className={!isVerified ? 'pointer-events-none blur-[1.5px]' : ''}>
        {/* ================= HEADER ================= */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">KAAIZEN</h1>

            <div className="flex items-center gap-6">
              <div className="relative cursor-pointer">
                <Bell size={24} />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notificationCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {trainer?.full_name?.[0] || 'T'}
                </div>
                <p className="font-semibold">{trainer?.full_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN ================= */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r p-6 hidden lg:block">
            <nav className="space-y-6">
              <NavItem icon="📊" label="Dashboard" active />
              <NavItem icon="👥" label="Clients" />
              <NavItem icon="📅" label="Sessions" />
              <NavItem icon="⏰" label="Slot" />
              <NavItem icon="💬" label="Messages" />
              <NavItem icon="💰" label="Earnings" />
              <NavItem icon="💳" label="Wallet" />
            </nav>

            <button
              onClick={logout}
              className="absolute bottom-8 left-6 text-sm text-slate-600 hover:text-slate-900"
            >
              logout
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            <h2 className="text-4xl font-bold mb-8">
              Good Morning, {trainer?.full_name || 'Trainer'}
            </h2>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Clients" value="40,689" trend="+8.5%" trendUp icon={<Users />} />
              <StatCard title="Monthly Earning" value="10293" trend="+1.3%" trendUp icon={<DollarSign />} />
              <StatCard title="Session This Week" value="$89,000" trend="-4.3%" icon={<Calendar />} />
            </div>

            {/* UPCOMING */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border">
                <h3 className="font-bold mb-4">Upcoming Sessions</h3>
                {upcomingSessions.map((s) => (
                  <SessionCard key={s.id} session={s} />
                ))}
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-bold mb-4">Performance Stats</h3>
                <p className="text-sm">Schedule Utilization</p>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-blue-500" style={{ width: '46%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= VERIFICATION OVERLAY ================= */}
      {!isVerified && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
            <Lock size={48} className="mx-auto text-purple-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Profile Not Verified</h2>
            <p className="text-slate-600 text-sm">
              Your profile is under admin review.  
              You will be able to access all features once verification is completed.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================== SMALL COMPONENTS ================== */

function StatCard({ title, value, trend, trendUp, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <div className="flex justify-between mb-2">
        <p className="text-sm text-slate-500">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className={trendUp ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
        {trend}
      </p>
    </div>
  )
}

function SessionCard({ session }) {
  return (
    <div className="flex justify-between items-center border rounded-lg p-4 mb-3">
      <div>
        <p className="font-semibold">{session.name}</p>
        <p className="text-sm text-slate-500">{session.category}</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
        Start
      </button>
    </div>
  )
}

function NavItem({ icon, label, active }) {
  return (
    <div className={`flex gap-3 px-4 py-2 rounded-lg ${active ? 'bg-slate-100 font-semibold' : ''}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}
