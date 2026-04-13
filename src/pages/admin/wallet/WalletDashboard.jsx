import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added
import { getAdminWalletSummary,getMonthlyRevenue, getPlatformWalletOverview } from '../../../services/admin/wallet/wallet'


// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const fmt = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(val ?? 0);

const fmtNum = (val) => new Intl.NumberFormat("en-IN").format(val ?? 0);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="stat-card" style={{ borderTopColor: accent }}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  );
}

function RoleBalanceRow({ role, data }) {
  const colors = { admin: "#f59e0b", trainer: "#34d399", client: "#60a5fa" };
  return (
    <div className="role-row">
      <span className="role-badge" style={{ background: colors[role] + "22", color: colors[role] }}>
        {role}
      </span>
      <span className="role-count">{fmtNum(data?.count)} wallets</span>
      <span className="role-balance">{fmt(data?.total_balance)}</span>
    </div>
  );
}

function RevenueBar({ month, total, max }) {
  const pct = max > 0 ? (total / max) * 100 : 0;
  return (
    <div className="rev-bar-wrap">
      <div className="rev-bar-track">
        <div className="rev-bar-fill" style={{ height: `${pct}%` }} />
      </div>
      <span className="rev-bar-label">{month}</span>
      <span className="rev-bar-value">{fmt(total)}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminWalletDashboard() {
  console.log("Dashboard rendered");

  const navigate = useNavigate(); 

  const currentYear = new Date().getFullYear();
  const [summary, setSummary] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [s, p] = await Promise.all([
          getAdminWalletSummary(),
          getPlatformWalletOverview(),
        ]);
        setSummary(s);
        setPlatform(p);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadRevenue = async () => {
      try {
        const data = await getMonthlyRevenue(year);
        setRevenue(data.monthly_revenue || []);
      } catch {
        setRevenue([]);
      }
    };
    loadRevenue();
  }, [year]);

  const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
    const found = revenue.find((r) => new Date(r.month).getMonth() === i);
    return { month: MONTHS[i], total: found?.total ?? 0, count: found?.count ?? 0 };
  });

  const maxRevenue = Math.max(...revenueByMonth.map((r) => r.total), 1);

  const txSummary = platform?.transaction_summary || {};
  const roleWallets = platform?.role_wallets || {};

  if (loading) return <div className="page-loading">Loading dashboard…</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="adw-page">
      
      {/* HEADER */}
      <header className="adw-header">
        <div>
          <h1 className="adw-title">Wallet Dashboard</h1>
          <p className="adw-subtitle">Admin financial overview</p>
        </div>

        {/* ✅ BUTTON GROUP */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

          <button
            onClick={() => navigate("/admin/transaction-page")}
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "600",
              border: "none",
              cursor: "pointer"
            }}
          >
            View Transactions
          </button>

          
          <button
            onClick={() => navigate("/admin/allwallet-page")}
            style={{
              background: "#16a34a",
              color: "#fff",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "600",
              border: "none",
              cursor: "pointer"
            }}
          >
            View All Wallets
          </button>

          <div className="adw-balance-badge">
            <span className="adw-balance-label">Admin Balance</span>
            <span className="adw-balance-value">{fmt(summary?.balance)}</span>
          </div>
        </div>
      </header>


      

      
      <section className="adw-section">
        <h2 className="section-title">Your Wallet</h2>
        <div className="stats-grid">
          <StatCard
            label="Total Credited"
            value={fmt(summary?.total_credited)}
            sub="Lifetime earnings"
            accent="#34d399"
          />
          <StatCard
            label="Total Debited"
            value={fmt(summary?.total_debited)}
            sub="Lifetime outflows"
            accent="#f87171"
          />
          <StatCard
            label="Transactions"
            value={fmtNum(summary?.total_transactions)}
            sub="All time"
            accent="#60a5fa"
          />
        </div>
      </section>

      {/* ── Platform overview ── */}
      <section className="adw-section two-col">
        <div className="card">
          <h2 className="section-title">Platform Wallets by Role</h2>
          {["admin", "trainer", "client"].map((r) => (
            <RoleBalanceRow key={r} role={r} data={roleWallets[r]} />
          ))}
        </div>

        <div className="card">
          <h2 className="section-title">Platform Transactions</h2>
          <div className="tx-stats">
            <div className="tx-stat">
              <span className="tx-stat-label">Total Volume In</span>
              <span className="tx-stat-value green">{fmt(txSummary.platform_total_credited)}</span>
            </div>
            <div className="tx-stat">
              <span className="tx-stat-label">Total Volume Out</span>
              <span className="tx-stat-value red">{fmt(txSummary.platform_total_debited)}</span>
            </div>
            <div className="tx-stat">
              <span className="tx-stat-label">All Transactions</span>
              <span className="tx-stat-value">{fmtNum(txSummary.total_transactions)}</span>
            </div>
            <div className="tx-stat">
              <span className="tx-stat-label">Pending</span>
              <span className="tx-stat-value amber">{fmtNum(txSummary.pending_count)}</span>
            </div>
            <div className="tx-stat">
              <span className="tx-stat-label">Failed</span>
              <span className="tx-stat-value red">{fmtNum(txSummary.failed_count)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Monthly Revenue Chart ── */}
      <section className="adw-section">
        <div className="section-head">
          <h2 className="section-title">Monthly Platform Revenue</h2>
          <select
            className="year-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="revenue-chart">
          {revenueByMonth.map((item) => (
            <RevenueBar key={item.month} {...item} max={maxRevenue} />
          ))}
        </div>
      </section>

      <style>{`
        .adw-page { padding: 2rem; max-width: 1200px; margin: 0 auto; font-family: 'DM Sans', sans-serif; color: #e2e8f0; }
        .adw-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem; }
        .adw-title { font-size: 1.75rem; font-weight: 700; color: #f1f5f9; margin: 0; }
        .adw-subtitle { color: #64748b; font-size: 0.875rem; margin: 0.25rem 0 0; }
        .adw-balance-badge { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 1rem 1.5rem; text-align: right; }
        .adw-balance-label { display: block; font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .adw-balance-value { font-size: 1.5rem; font-weight: 700; color: #34d399; }
        .adw-section { margin-bottom: 2rem; }
        .adw-section.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .section-title { font-size: 0.875rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 1rem; }
        .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 1.5rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .stat-card { background: #0f172a; border: 1px solid #1e293b; border-top: 3px solid; border-radius: 12px; padding: 1.25rem 1.5rem; }
        .stat-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.5rem; }
        .stat-value { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin: 0; }
        .stat-sub { font-size: 0.75rem; color: #475569; margin: 0.25rem 0 0; }
        .role-row { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #1e293b; }
        .role-row:last-child { border-bottom: none; }
        .role-badge { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.2rem 0.6rem; border-radius: 6px; }
        .role-count { font-size: 0.8rem; color: #64748b; flex: 1; }
        .role-balance { font-weight: 600; color: #f1f5f9; font-size: 0.95rem; }
        .tx-stats { display: flex; flex-direction: column; gap: 0.75rem; }
        .tx-stat { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #1e293b; }
        .tx-stat:last-child { border-bottom: none; }
        .tx-stat-label { font-size: 0.8rem; color: #64748b; }
        .tx-stat-value { font-weight: 600; font-size: 0.95rem; color: #f1f5f9; }
        .tx-stat-value.green { color: #34d399; }
        .tx-stat-value.red { color: #f87171; }
        .tx-stat-value.amber { color: #f59e0b; }
        .revenue-chart { display: flex; align-items: flex-end; gap: 0.5rem; height: 180px; background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 1.5rem 1rem 0.75rem; }
        .rev-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; height: 100%; }
        .rev-bar-track { flex: 1; width: 100%; background: #1e293b; border-radius: 4px; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
        .rev-bar-fill { background: linear-gradient(to top, #34d399, #059669); border-radius: 4px; transition: height 0.6s ease; min-height: 2px; }
        .rev-bar-label { font-size: 0.65rem; color: #475569; font-weight: 600; }
        .rev-bar-value { display: none; }
        .year-select { background: #0f172a; border: 1px solid #1e293b; color: #e2e8f0; border-radius: 8px; padding: 0.4rem 0.75rem; font-size: 0.875rem; cursor: pointer; }
        .page-loading, .page-error { display: flex; align-items: center; justify-content: center; min-height: 300px; color: #64748b; font-size: 0.9rem; }
        .page-error { color: #f87171; }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr; }
          .adw-section.two-col { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}