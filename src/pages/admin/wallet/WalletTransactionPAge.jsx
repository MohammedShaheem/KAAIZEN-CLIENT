import { useEffect, useState, useCallback } from "react";
import { getAdminTransactions } from "@/services/admin/wallet/wallet";

const fmt = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(val ?? 0);

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

const STATUS_COLORS = {
  success: { bg: "#052e16", color: "#34d399", label: "Success" },
  pending: { bg: "#451a03", color: "#f59e0b", label: "Pending" },
  failed:  { bg: "#450a0a", color: "#f87171", label: "Failed" },
};

const ENTRY_COLORS = {
  credit: "#34d399",
  debit:  "#f87171",
};

const FILTER_DEFAULTS = {
  entry_type: "",
  transaction_type: "",
  status: "",
  date_from: "",
  date_to: "",
  search: "",
  ordering: "-created_at",
  page: 1,
  page_size: 20,
};

function FilterBar({ filters, onChange, onReset }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value, page: 1 });

  return (
    <div className="filter-bar">
      <input
        className="filter-input"
        placeholder="Search description, reference…"
        value={filters.search}
        onChange={set("search")}
      />
      <select className="filter-select" value={filters.entry_type} onChange={set("entry_type")}>
        <option value="">All Types</option>
        <option value="credit">Credit</option>
        <option value="debit">Debit</option>
      </select>
      <select className="filter-select" value={filters.status} onChange={set("status")}>
        <option value="">All Status</option>
        <option value="success">Success</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>
      <input
        type="date"
        className="filter-input date-input"
        value={filters.date_from}
        onChange={set("date_from")}
        placeholder="From"
      />
      <input
        type="date"
        className="filter-input date-input"
        value={filters.date_to}
        onChange={set("date_to")}
        placeholder="To"
      />
      <select className="filter-select" value={filters.ordering} onChange={set("ordering")}>
        <option value="-created_at">Newest First</option>
        <option value="created_at">Oldest First</option>
        <option value="-amount">Highest Amount</option>
        <option value="amount">Lowest Amount</option>
      </select>
      <button className="reset-btn" onClick={onReset}>Reset</button>
    </div>
  );
}

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.total_pages <= 1) return null;
  const { page, total_pages, total_count, page_size } = pagination;
  const start = (page - 1) * page_size + 1;
  const end = Math.min(page * page_size, total_count);

  return (
    <div className="pagination">
      <span className="page-info">{start}–{end} of {total_count}</span>
      <div className="page-btns">
        <button
          className="page-btn"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >← Prev</button>
        <span className="page-current">{page} / {total_pages}</span>
        <button
          className="page-btn"
          disabled={page === total_pages}
          onClick={() => onPageChange(page + 1)}
        >Next →</button>
      </div>
    </div>
  );
}

export default function AdminTransactionsPage() {
  const [filters, setFilters] = useState(FILTER_DEFAULTS);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Strip empty strings before sending
      const clean = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "")
      );
      const res = await getAdminTransactions(clean);
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleReset = () => setFilters(FILTER_DEFAULTS);
  const handlePageChange = (p) => setFilters((f) => ({ ...f, page: p }));

  return (
    <div className="atp-page">
      <header className="atp-header">
        <div>
          <h1 className="atp-title">Admin Transactions</h1>
          <p className="atp-subtitle">Your wallet's transaction history</p>
        </div>
        {data?.pagination && (
          <span className="total-badge">{data.pagination.total_count} records</span>
        )}
      </header>

      <FilterBar filters={filters} onChange={setFilters} onReset={handleReset} />

      {error && <div className="err-banner">{error}</div>}

      <div className="table-wrap">
        <table className="tx-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Entry</th>
              <th>Amount</th>
              <th>Balance After</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="table-empty">Loading…</td></tr>
            ) : !data?.results?.length ? (
              <tr><td colSpan={7} className="table-empty">No transactions found.</td></tr>
            ) : data.results.map((tx) => {
              const s = STATUS_COLORS[tx.status] || STATUS_COLORS.pending;
              return (
                <tr key={tx.id} className="tx-row">
                  <td className="td-date">{fmtDate(tx.created_at)}</td>
                  <td><span className="tx-type">{tx.transaction_type?.replace(/_/g, " ")}</span></td>
                  <td>
                    <span className="entry-pill" style={{ color: ENTRY_COLORS[tx.entry_type] }}>
                      {tx.entry_type === "credit" ? "▲" : "▼"} {tx.entry_type}
                    </span>
                  </td>
                  <td className="td-amount" style={{ color: ENTRY_COLORS[tx.entry_type] }}>
                    {fmt(tx.amount)}
                  </td>
                  <td className="td-balance">{fmt(tx.balance_after)}</td>
                  <td>
                    <span className="status-pill" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </td>
                  <td className="td-desc">{tx.description || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination pagination={data?.pagination} onPageChange={handlePageChange} />

      <style>{`
        .atp-page { padding: 2rem; max-width: 1300px; margin: 0 auto; font-family: 'DM Sans', sans-serif; color: #e2e8f0; }
        .atp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .atp-title { font-size: 1.75rem; font-weight: 700; color: #f1f5f9; margin: 0; }
        .atp-subtitle { color: #64748b; font-size: 0.875rem; margin: 0.25rem 0 0; }
        .total-badge { background: #1e293b; color: #94a3b8; font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: 20px; align-self: center; }
        .filter-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
        .filter-input { background: #0f172a; border: 1px solid #1e293b; color: #e2e8f0; border-radius: 8px; padding: 0.45rem 0.75rem; font-size: 0.8rem; flex: 1; min-width: 180px; }
        .filter-input::placeholder { color: #475569; }
        .date-input { min-width: 130px; flex: 0; }
        .filter-select { background: #0f172a; border: 1px solid #1e293b; color: #e2e8f0; border-radius: 8px; padding: 0.45rem 0.75rem; font-size: 0.8rem; cursor: pointer; }
        .reset-btn { background: #1e293b; border: 1px solid #334155; color: #94a3b8; border-radius: 8px; padding: 0.45rem 1rem; font-size: 0.8rem; cursor: pointer; transition: background 0.2s; }
        .reset-btn:hover { background: #334155; }
        .err-banner { background: #450a0a; border: 1px solid #7f1d1d; color: #f87171; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.85rem; margin-bottom: 1rem; }
        .table-wrap { overflow-x: auto; border: 1px solid #1e293b; border-radius: 12px; }
        .tx-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        .tx-table th { background: #0f172a; color: #64748b; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 600; padding: 0.9rem 1rem; text-align: left; border-bottom: 1px solid #1e293b; white-space: nowrap; }
        .tx-row { border-bottom: 1px solid #0f172a; transition: background 0.15s; }
        .tx-row:hover { background: #0f172a; }
        .tx-table td { padding: 0.85rem 1rem; color: #cbd5e1; vertical-align: middle; }
        .td-date { color: #64748b; white-space: nowrap; font-size: 0.75rem; }
        .tx-type { text-transform: capitalize; font-size: 0.78rem; color: #94a3b8; }
        .entry-pill { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .td-amount { font-weight: 700; font-size: 0.9rem; }
        .td-balance { color: #94a3b8; }
        .status-pill { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.2rem 0.6rem; border-radius: 20px; }
        .td-desc { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #64748b; font-size: 0.78rem; }
        .table-empty { text-align: center; color: #475569; padding: 3rem !important; }
        .pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 0.75rem; }
        .page-info { font-size: 0.8rem; color: #64748b; }
        .page-btns { display: flex; align-items: center; gap: 0.75rem; }
        .page-btn { background: #0f172a; border: 1px solid #1e293b; color: #e2e8f0; border-radius: 8px; padding: 0.4rem 0.9rem; font-size: 0.8rem; cursor: pointer; transition: background 0.2s; }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .page-btn:not(:disabled):hover { background: #1e293b; }
        .page-current { font-size: 0.8rem; color: #64748b; }
      `}</style>
    </div>
  );
}