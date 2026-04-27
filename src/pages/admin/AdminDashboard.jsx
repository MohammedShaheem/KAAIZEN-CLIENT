import { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../../services/admin/admin";
import StatCard from "@/components/admin/ui/StatCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Builds a 7-day simulated growth trend from new_users.
 * Replace with real time-series data from your API when available.
 */
function buildWeeklyTrend(newUsers = 0) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weights = [0.10, 0.14, 0.16, 0.18, 0.20, 0.13, 0.09];
  return days.map((day, i) => ({
    day,
    users: Math.round(newUsers * weights[i]),
  }));
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-4 py-2 text-sm">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-[#7B1FA2]">{payload[0].value} users</p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-4 py-2 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Chart Section ───────────────────────────────────────────────────────────

function ChartsSection({ stats }) {
  // Pie: user role distribution
  const roleData = [
    { name: "Clients", value: stats.clients ?? 0 },
    { name: "Trainers", value: stats.trainers ?? 0 },
    {
      name: "Others",
      value: Math.max(
        0,
        (stats.total_users ?? 0) - (stats.clients ?? 0) - (stats.trainers ?? 0)
      ),
    },
  ].filter((d) => d.value > 0);

  const PIE_COLORS = ["#7B1FA2", "#AB47BC", "#CE93D8"];

  // Bar: active vs inactive
  const activityData = [
    {
      label: "Users",
      Active: stats.active_users ?? 0,
      Inactive: Math.max(0, (stats.total_users ?? 0) - (stats.active_users ?? 0)),
    },
  ];

  // Area: 7-day new user trend
  const weeklyData = buildWeeklyTrend(stats.new_users);

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Charts &amp; Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── 1. User Role Distribution (Donut) ── */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            User Role Distribution
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {roleData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
              {roleData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  {entry.name}
                  <span className="font-semibold text-gray-800">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 2. Active vs Inactive Users (Bar) ── */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Active vs Inactive Users
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={activityData} barSize={44} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#F9FAFB" }} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                  formatter={(value) => <span className="text-gray-600">{value}</span>}
                />
                <Bar dataKey="Active" name="Active" fill="#7B1FA2" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Inactive" name="Inactive" fill="#E9D5F5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── 3. New Users — 7-Day Trend (Area) ── */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            New Users — Last 7 Days
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B1FA2" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#7B1FA2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ stroke: "#E9D5F5", strokeWidth: 2 }} />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="New Users"
                  stroke="#7B1FA2"
                  strokeWidth={2.5}
                  fill="url(#areaGradient)"
                  dot={{ r: 4, fill: "#7B1FA2", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#7B1FA2", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            * Estimated daily distribution from weekly total
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminDashboard()
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#7B1FA2] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid — Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Users" value={stats.total_users} />
        <StatCard title="Active Users" value={stats.active_users} />
        <StatCard title="Clients" value={stats.clients} />
        <StatCard title="Trainers" value={stats.trainers} />
      </div>

      {/* Stats Grid — Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <StatCard title="New Users (Last 7 Days)" value={stats.new_users} />
      </div>

      {/* Charts & Analytics */}
      <ChartsSection stats={stats} />
    </>
  );
}