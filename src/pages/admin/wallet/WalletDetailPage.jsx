import { useEffect, useState } from "react";
import { getUserWalletDetail, toggleWalletStatus } from "../../../services/admin/wallet/wallet";

const fmt = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(val ?? 0);

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })
    : "—";

const ROLE_COLORS = {
  admin:   { bg: "#451a03", color: "#f59e0b" },
  trainer: { bg: "#052e16", color: "#34d399" },
  client:  { bg: "#0c1a2e", color: "#60a5fa" },
};

function StatCard({ label, value, accent }) {
  return (
    <div className="detail-stat" style={{ borderTopColor: accent }}>
      <p className="detail-stat-label">{label}</p>
      <p className="detail-stat-value">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value ?? "—"}</span>
    </div>
  );
}

/**
 * @param {string}   walletId  - UUID of the wallet to load
 * @param {function} onBack    - called when user clicks "Back"
 */
export default function AdminWalletDetailPage({ walletId, onBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(false);
  const [toggleError, setToggleError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserWalletDetail(walletId);
        setDetail(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [walletId]);

  const handleToggle = async () => {
    if (!window.confirm("Toggle this wallet's active status?")) return;
    setToggling(true);
    setToggleError(null);
    try {
      const result = await toggleWalletStatus(walletId);
      setDetail((prev) => ({ ...prev, is_active: result.is_active }));
    } catch (e) {
      setToggleError(e.message);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="wdp-page">
        {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
        <div className="page-loading">Loading wallet details…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wdp-page">
        {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
        <div className="page-error">{error}</div>
      </div>
    );
  }

  const rc = ROLE_COLORS[detail?.user?.role] || ROLE_COLORS.client;
  const netFlow = (detail?.total_credited ?? 0) - (detail?.total_debited ?? 0);

  return (
    <div className="wdp-page">
      {/* ── Header ── */}
      <header className="wdp-header">
        <div className="wdp-header-left">
          {onBack && (
            <button className="back-btn" onClick={onBack}>← Back</button>
          )}
          <div>
            <div className="wdp-name-row">
              <h1 className="wdp-title">{detail.user?.full_name || "—"}</h1>
              <span className="role-pill" style={{ background: rc.bg, color: rc.color }}>
                {detail.user?.role}
              </span>
              <span className={`active-pill ${detail.is_active ? "active" : "inactive"}`}>
                {detail.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="wdp-email">{detail.user?.email}</p>
          </div>
        </div>
        <button
          className={`toggle-btn ${detail.is_active ? "deactivate" : "activate"}`}
          onClick={handleToggle}
          disabled={toggling}
        >
          {toggling ? "Updating…" : detail.is_active ? "Deactivate Wallet" : "Activate Wallet"}
        </button>
      </header>

      {toggleError && <div className="err-banner">{toggleError}</div>}

      {/* ── Balance hero ── */}
      <div className="balance-hero">
        <div>
          <p className="balance-label">Current Balance</p>
          <p className="balance-value">{fmt(detail.balance)}</p>
          <p className="balance-currency">{detail.currency}</p>
        </div>
        <div className="balance-meta">
          <p className="meta-item">
            <span className="meta-label">Wallet ID</span>
            <span className="meta-value mono">{detail.wallet_id}</span>
          </p>
          <p className="meta-item">
            <span className="meta-label">Created</span>
            <span className="meta-value">{fmtDate(detail.created_at)}</span>
          </p>
          <p className="meta-item">
            <span className="meta-label">Last Updated</span>
            <span className="meta-value">{fmtDate(detail.updated_at)}</span>
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="wdp-section">
        <h2 className="section-title">Transaction Summary</h2>
        <div className="detail-stats-grid">
          <StatCard label="Total Credited" value={fmt(detail.total_credited)} accent="#34d399" />
          <StatCard label="Total Debited"  value={fmt(detail.total_debited)}  accent="#f87171" />
          <StatCard
            label="Net Flow"
            value={fmt(Math.abs(netFlow))}
            accent={netFlow >= 0 ? "#34d399" : "#f87171"}
          />
          <StatCard label="Total Transactions" value={detail.total_transactions ?? 0} accent="#60a5fa" />
        </div>
      </section>

      {/* ── User info ── */}
      <section className="wdp-section">
        <h2 className="section-title">User Information</h2>
        <div className="info-card">
          <InfoRow label="User ID"    value={<span className="mono">{detail.user?.id}</span>} />
          <InfoRow label="Full Name"  value={detail.user?.full_name} />
          <InfoRow label="Email"      value={detail.user?.email} />
          <InfoRow label="Role"       value={detail.user?.role} />
        </div>
      </section>

      <style>{`
        .wdp-page { padding: 2rem; max-width: 1000px; margin: 0 auto; font-family: 'DM Sans', sans-serif; color: #e2e8f0; }
        .back-btn { background: none; border: 1px solid #1e293b; color: #64748b; border-radius: 8px; padding: 0.4rem 0.9rem; font-size: 0.8rem; cursor: pointer; margin-bottom: 1.25rem; display: inline-block; transition: border-color 0.15s, color 0.15s; }
        .back-btn:hover { border-color: #334155; color: #94a3b8; }
        .wdp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .wdp-header-left { display: flex; flex-direction: column; gap: 0.5rem; }
        .wdp-name-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .wdp-title { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin: 0; }
        .wdp-email { color: #64748b; font-size: 0.875rem; margin: 0; }
        .role-pill { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; padding: 0.2rem 0.6rem; border-radius: 20px; }
        .active-pill { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 20px; }
        .active-pill.active   { background: #052e16; color: #34d399; }
        .active-pill.inactive { background: #450a0a; color: #f87171; }
        .toggle-btn { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.5rem 1.25rem; border-radius: 8px; cursor: pointer; border: 1px solid; transition: opacity 0.15s; align-self: flex-start; }
        .toggle-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .toggle-btn.deactivate { background: #450a0a22; border-color: #7f1d1d; color: #f87171; }
        .toggle-btn.activate   { background: #052e1622; border-color: #14532d; color: #34d399; }
        .err-banner { background: #450a0a; border: 1px solid #7f1d1d; color: #f87171; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.85rem; margin-bottom: 1.25rem; }
        .balance-hero { background: #0f172a; border: 1px solid #1e293b; border-radius: 14px; padding: 2rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem; }
        .balance-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 0.5rem; }
        .balance-value { font-size: 2.5rem; font-weight: 800; color: #34d399; margin: 0; line-height: 1; }
        .balance-currency { font-size: 0.8rem; color: #475569; margin: 0.4rem 0 0; }
        .balance-meta { display: flex; flex-direction: column; gap: 0.6rem; align-items: flex-end; }
        .meta-item { margin: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem; }
        .meta-label { font-size: 0.68rem; color: #475569; text-transform: uppercase; letter-spacing: 0.06em; }
        .meta-value { font-size: 0.8rem; color: #94a3b8; }
        .meta-value.mono { font-family: monospace; font-size: 0.72rem; color: #64748b; }
        .wdp-section { margin-bottom: 1.75rem; }
        .section-title { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 1rem; }
        .detail-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .detail-stat { background: #0f172a; border: 1px solid #1e293b; border-top: 3px solid; border-radius: 10px; padding: 1rem 1.25rem; }
        .detail-stat-label { font-size: 0.72rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.5rem; }
        .detail-stat-value { font-size: 1.25rem; font-weight: 700; color: #f1f5f9; margin: 0; }
        .info-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; }
        .info-row { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.25rem; border-bottom: 1px solid #0a0f1a; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-size: 0.78rem; color: #64748b; }
        .info-value { font-size: 0.85rem; color: #e2e8f0; font-weight: 500; }
        .mono { font-family: monospace; font-size: 0.72rem; color: #64748b; }
        .page-loading, .page-error { display: flex; align-items: center; justify-content: center; min-height: 200px; color: #64748b; font-size: 0.9rem; }
        .page-error { color: #f87171; }
        @media (max-width: 768px) {
          .detail-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .balance-hero { flex-direction: column; }
          .balance-meta { align-items: flex-start; }
          .meta-item { align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}