import React from 'react';
import Sidebar from '@/components/trainer/ui/sidebar';
import useLogout from '@/hooks/common/useLogout';
import { useTrainerProfile } from '@/hooks/trainer/useTrainerProfile';
import { useTrainerDashboard } from '@/hooks/trainer/dashboard/useTrainerDashboard';
import {
  Bell,
  Users,
  DollarSign,
  Calendar,
  Lock,
  LogOut,
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function Dashboard() {
  const logout = useLogout();

  const { data: trainer, isLoading: profileLoading } = useTrainerProfile();
  const { data, isLoading: dashboardLoading } = useTrainerDashboard();

  if (profileLoading || dashboardLoading) return null;

  const isVerified = trainer?.is_verified === true;

  const stats = data?.stats || {};
  const upcomingSessions = data?.upcoming_sessions || [];

  /* ---------------- GRAPH DATA ---------------- */

  // Dummy income data (you'll replace later)
  const incomeData = [
    { month: 'Jan', income: 12000 },
    { month: 'Feb', income: 18000 },
    { month: 'Mar', income: 15000 },
    { month: 'Apr', income: 22000 },
    { month: 'May', income: 26000 },
  ];

  // REAL client count (derived from backend)
  const clientGrowthData = [
    { label: 'Active Clients', value: stats.active_clients ?? 0 },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50">
      <div className={!isVerified ? 'pointer-events-none blur-[1.5px]' : ''}>
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">KAAIZEN</h1>

            <div className="flex items-center gap-6">
              <Bell size={22} />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {trainer?.full_name?.[0] || 'T'}
                </div>
                <p className="font-semibold">{trainer?.full_name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Component */}
          <Sidebar logout={logout} />

          {/* Main */}
          <div className="flex-1 p-8">
            <h2 className="text-4xl font-bold mb-8">
              Welcome back, {trainer?.full_name}
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard
                title="Active Clients"
                value={stats.active_clients ?? 0}
                icon={<Users />}
              />
              <StatCard
                title="Monthly Earnings"
                value={`₹${stats.monthly_earnings ?? 0}`}
                icon={<DollarSign />}
              />
              <StatCard
                title="Sessions This Week"
                value={stats.weekly_sessions ?? 0}
                icon={<Calendar />}
              />
            </div>

            {/* Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* Income Graph */}
              <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-bold mb-4">Income Overview</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={incomeData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#6366f1"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Client Count Graph */}
              <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-bold mb-4">Client Count</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={clientGrowthData}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="#22c55e"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming + Utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border">
                <h3 className="font-bold mb-4">Upcoming Sessions</h3>

                {upcomingSessions.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No upcoming sessions
                  </p>
                ) : (
                  upcomingSessions.map((s) => (
                    <SessionCard
                      key={s.id}
                      name={s.client_name}
                      time={`${s.session_date} · ${s.start_time} - ${s.end_time}`}
                    />
                  ))
                )}
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-bold mb-4">Schedule Utilization</h3>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{
                      width: `${stats.schedule_utilization ?? 0}%`,
                    }}
                  />
                </div>
                <p className="text-sm mt-2 font-semibold">
                  {stats.schedule_utilization ?? 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Lock */}
      {!isVerified && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
            <Lock size={48} className="mx-auto text-purple-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">
              Profile Not Verified
            </h2>
            <p className="text-slate-600 text-sm mb-6">
              Your profile is under admin review.
            </p>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <div className="flex justify-between mb-2">
        <p className="text-sm text-slate-500">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function SessionCard({ name, time }) {
  return (
    <div className="flex justify-between items-center border rounded-lg p-4 mb-3">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-slate-500">{time}</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
        View
      </button>
    </div>
  );
}
