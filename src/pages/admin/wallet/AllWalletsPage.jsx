import { useEffect, useState, useCallback } from "react";
import { getAllUserWallets, toggleWalletStatus } from "../../../services/admin/wallet/wallet";
import AdminWalletDetailPage from "./WalletDetailPage";

const fmt = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(val ?? 0);

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—";

const ROLE_COLORS = {
  admin:   { bg: "#451a03", color: "#f59e0b" },
  trainer: { bg: "#052e16", color: "#34d399" },
  client:  { bg: "#0c1a2e", color: "#60a5fa" },
};

const FILTER_DEFAULTS = {
  role: "",
  is_active: "",
  search: "",
  ordering: "-created_at",
  page: 1,
  page_size: 20,
};

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.total_pages <= 1) return null;
  const { page, total_pages, total_count, page_size } = pagination;
  const start = (page - 1) * page_size + 1;
  const end = Math.min(page * page_size, total_count);
  return (
    <div className="pagination">
      <span className="page-info">{start}–{end} of {total_count}</span>
      <div className="page-btns">
        <button className="page-btn" disabled={page === 1} onClick={() => onPageChange(page - 1)}>← Prev</button>
        <span className="page-current">{page} / {total_pages}</span>
        <button className="page-btn" disabled={page === total_pages} onClick={() => onPageChange(page + 1)}>Next →</button>
      </div>
    </div>
  );
}

export default function AdminAllWalletsPage() {
  const [filters, setFilters] = useState(FILTER_DEFAULTS);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(null);   // walletId being toggled
  const [selectedWallet, setSelectedWallet] = useState(null); // drilldown

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clean = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "")
      );
      const res = await getAllUserWallets(clean);
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (walletId, e) => {
    e.stopPropagation();
    if (!window.confirm("Toggle this wallet's active status?")) return;
    setToggling(walletId);
    try {
      const result = await toggleWalletStatus(walletId);
      // Optimistically update the row
      setData((prev) => ({
        ...prev,
        results: prev.results.map((w) =>
          w.id === walletId ? { ...w, is_active: result.is_active } : w
        ),
      }));
    } catch (e) {
      alert(e.message);
    } finally {
      setToggling(null);
    }
  };

  if (selectedWallet) {
    return (
      <AdminWalletDetailPage
        walletId={selectedWallet}
        onBack={() => setSelectedWallet(null)}
      />
    );
  }

  return (
    <div className="awp-page">
      <header className="awp-header">
        <div>
          <h1 className="awp-title">All Wallets</h1>
          <p className="awp-subtitle">Manage wallets across all roles</p>
        </div>
        {data?.pagination && (
          <span className="total-badge">{data.pagination.total_count} wallets</span>
        )}
      </header>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="filter-input"
          placeholder="Search by name or email…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
        />
        <select
          className="filter-select"
          value={filters.role}
          onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value, page: 1 }))}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="trainer">Trainer</option>
          <option value="client">Client</option>
        </select>
        <select
          className="filter-select"
          value={filters.is_active}
          onChange={(e) => setFilters((f) => ({ ...f, is_active: e.target.value, page: 1 }))}
        >
          <option value="">Any Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <select
          className="filter-select"
          value={filters.ordering}
          onChange={(e) => setFilters((f) => ({ ...f, ordering: e.target.value, page: 1 }))}
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="-balance">Highest Balance</option>
          <option value="balance">Lowest Balance</option>
        </select>
        <button className="reset-btn" onClick={() => setFilters(FILTER_DEFAULTS)}>Reset</button>
      </div>

      {error && <div className="err-banner">{error}</div>}

      <div className="table-wrap">
        <table className="wallet-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Balance</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="table-empty">Loading…</td></tr>
            ) : !data?.results?.length ? (
              <tr><td colSpan={7} className="table-empty">No wallets found.</td></tr>
            ) : data.results.map((w) => {
              const rc = ROLE_COLORS[w.user__role] || ROLE_COLORS.client;
              return (
                <tr
                  key={w.id}
                  className="wallet-row clickable"
                  onClick={() => setSelectedWallet(w.id)}
                >
                  <td className="td-user">
                    <span className="user-name">
                      {w.user__first_name} {w.user__last_name}
                    </span>
                    <span className="user-email">{w.user__email}</span>
                  </td>
                  <td>
                    <span className="role-pill" style={{ background: rc.bg, color: rc.color }}>
                      {w.user__role}
                    </span>
                  </td>
                  <td className="td-balance">{fmt(w.balance)}</td>
                  <td className="td-currency">{w.currency}</td>
                  <td>
                    <span className={`status-dot ${w.is_active ? "active" : "inactive"}`}>
                      {w.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="td-date">{fmtDate(w.created_at)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      className={`toggle-btn ${w.is_active ? "deactivate" : "activate"}`}
                      disabled={toggling === w.id}
                      onClick={(e) => handleToggle(w.id, e)}
                    >
                      {toggling === w.id
                        ? "…"
                        : w.is_active
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        pagination={data?.pagination}
        onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
      />

      <style>{`
        .awp-page { padding: 2rem; max-width: 1300px; margin: 0 auto; font-family: 'DM Sans', sans-serif; color: #e2e8f0; }
        .awp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .awp-title { font-size: 1.75rem; font-weight: 700; color: #f1f5f9; margin: 0; }
        .awp-subtitle { color: #64748b; font-size: 0.875rem; margin: 0.25rem 0 0; }
        .total-badge { background: #1e293b; color: #94a3b8; font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: 20px; align-self: center; }
        .filter-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
        .filter-input { background: #0f172a; border: 1px solid #1e293b; color: #e2e8f0; border-radius: 8px; padding: 0.45rem 0.75rem; font-size: 0.8rem; flex: 1; min-width: 200px; }
        .filter-input::placeholder { color: #475569; }
        .filter-select { background: #0f172a; border: 1px solid #1e293b; color: #e2e8f0; border-radius: 8px; padding: 0.45rem 0.75rem; font-size: 0.8rem; cursor: pointer; }
        .reset-btn { background: #1e293b; border: 1px solid #334155; color: #94a3b8; border-radius: 8px; padding: 0.45rem 1rem; font-size: 0.8rem; cursor: pointer; }
        .reset-btn:hover { background: #334155; }
        .err-banner { background: #450a0a; border: 1px solid #7f1d1d; color: #f87171; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.85rem; margin-bottom: 1rem; }
        .table-wrap { overflow-x: auto; border: 1px solid #1e293b; border-radius: 12px; }
        .wallet-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        .wallet-table th { background: #0f172a; color: #64748b; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 600; padding: 0.9rem 1rem; text-align: left; border-bottom: 1px solid #1e293b; white-space: nowrap; }
        .wallet-row { border-bottom: 1px solid #0f172a; transition: background 0.15s; }
        .wallet-row.clickable { cursor: pointer; }
        .wallet-row:hover { background: #0f172a; }
        .wallet-table td { padding: 0.85rem 1rem; color: #cbd5e1; vertical-align: middle; }
        .td-user { min-width: 180px; }
        .user-name { display: block; font-weight: 600; color: #f1f5f9; }
        .user-email { display: block; font-size: 0.72rem; color: #64748b; }
        .role-pill { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; padding: 0.2rem 0.6rem; border-radius: 20px; }
        .td-balance { font-weight: 700; color: #34d399; font-size: 0.9rem; }
        .td-currency { color: #64748b; font-size: 0.78rem; }
        .status-dot { font-size: 0.75rem; font-weight: 600; }
        .status-dot.active { color: #34d399; }
        .status-dot.inactive { color: #f87171; }
        .td-date { color: #475569; font-size: 0.78rem; white-space: nowrap; }
        .table-empty { text-align: center; color: #475569; padding: 3rem !important; }
        .toggle-btn { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.3rem 0.75rem; border-radius: 6px; cursor: pointer; border: 1px solid; transition: opacity 0.15s; }
        .toggle-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .toggle-btn.deactivate { background: #450a0a22; border-color: #7f1d1d; color: #f87171; }
        .toggle-btn.activate   { background: #052e1622; border-color: #14532d; color: #34d399; }
        .pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 0.75rem; }
        .page-info { font-size: 0.8rem; color: #64748b; }
        .page-btns { display: flex; align-items: center; gap: 0.75rem; }
        .page-btn { background: #0f172a; border: 1px solid #1e293b; color: #e2e8f0; border-radius: 8px; padding: 0.4rem 0.9rem; font-size: 0.8rem; cursor: pointer; }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .page-btn:not(:disabled):hover { background: #1e293b; }
        .page-current { font-size: 0.8rem; color: #64748b; }
      `}</style>
    </div>
  );
}