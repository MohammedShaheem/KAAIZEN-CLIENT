import { useCallback } from "react";
import { useWallet } from "@/hooks/common/useWallet";

const ENTRY_TYPE_OPTIONS = ["CREDIT", "DEBIT"];
const STATUS_OPTIONS = ["SUCCESS", "PENDING", "FAILED"];
const ORDERING_OPTIONS = [
  { label: "Newest first", value: "-created_at" },
  { label: "Oldest first", value: "created_at" },
  { label: "Amount ↑", value: "amount" },
  { label: "Amount ↓", value: "-amount" },
];

function Badge({ type, value }) {
  const styles = {
    CREDIT:   "bg-teal-50 text-teal-800",
    DEBIT:    "bg-orange-50 text-orange-800",
    SUCCESS:  "bg-green-50 text-green-800",
    PENDING:  "bg-amber-50 text-amber-800",
    FAILED:   "bg-red-50 text-red-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[value] ?? "bg-gray-100 text-gray-700"}`}>
      {value}
    </span>
  );
}

function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { label: "Current balance", value: summary.balance, highlight: true },
        { label: "Currency", value: summary.currency },
        { label: "Status", value: summary.is_active ? "Active" : "Inactive" },
      ].map(({ label, value, highlight }) => (
        <div key={label} className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={`text-xl font-medium ${highlight ? "text-emerald-700" : ""}`}>
            {highlight ? `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : value}
          </p>
        </div>
      ))}
    </div>
  );
}

function FilterBar({ filters, updateFilter, resetFilters }) {
  return (
    <div className="flex flex-wrap gap-3 items-end mb-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Type</label>
        <select
          value={filters.entry_type}
          onChange={(e) => updateFilter("entry_type", e.target.value)}
          className="h-8 text-sm border border-gray-200 rounded-md px-2 bg-white"
        >
          <option value="">All types</option>
          {ENTRY_TYPE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Status</label>
        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="h-8 text-sm border border-gray-200 rounded-md px-2 bg-white"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">From</label>
        <input
          type="date"
          value={filters.date_from}
          onChange={(e) => updateFilter("date_from", e.target.value)}
          className="h-8 text-sm border border-gray-200 rounded-md px-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">To</label>
        <input
          type="date"
          value={filters.date_to}
          onChange={(e) => updateFilter("date_to", e.target.value)}
          className="h-8 text-sm border border-gray-200 rounded-md px-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Min ₹</label>
        <input
          type="number"
          value={filters.amount_min}
          onChange={(e) => updateFilter("amount_min", e.target.value)}
          placeholder="0"
          className="h-8 w-24 text-sm border border-gray-200 rounded-md px-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Max ₹</label>
        <input
          type="number"
          value={filters.amount_max}
          onChange={(e) => updateFilter("amount_max", e.target.value)}
          placeholder="∞"
          className="h-8 w-24 text-sm border border-gray-200 rounded-md px-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Sort</label>
        <select
          value={filters.ordering}
          onChange={(e) => updateFilter("ordering", e.target.value)}
          className="h-8 text-sm border border-gray-200 rounded-md px-2 bg-white"
        >
          {ORDERING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="h-8 px-3 text-sm border border-gray-200 rounded-md hover:bg-gray-50 text-gray-500 mt-5"
      >
        Reset
      </button>
    </div>
  );
}

function TransactionTable({ transactions }) {
  if (!transactions.length) {
    return <p className="text-center text-sm text-gray-400 py-12">No transactions found.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100">
          {["Description", "Type", "Status", "Amount", "Balance after", "Date"].map((h) => (
            <th key={h} className="text-left text-xs text-gray-400 font-medium pb-3 px-3">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td className="px-3 py-3">
              <span className="font-medium">{tx.description || "—"}</span>
              <br />
              <span className="text-xs text-gray-400">{tx.transaction_type}</span>
            </td>
            <td className="px-3 py-3"><Badge type="entry" value={tx.entry_type} /></td>
            <td className="px-3 py-3"><Badge type="status" value={tx.status} /></td>
            <td className={`px-3 py-3 font-medium ${tx.entry_type === "CREDIT" ? "text-emerald-700" : "text-orange-700"}`}>
              {tx.entry_type === "CREDIT" ? "+" : "−"}₹{Number(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>
            <td className="px-3 py-3 text-gray-500">
              ₹{Number(tx.balance_after).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>
            <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
              {new Date(tx.created_at).toLocaleString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function WalletPage({ fetchSummary, fetchTransactions }) {
  const stableFetchSummary = useCallback(fetchSummary, []);
  const stableFetchTransactions = useCallback(fetchTransactions, []);

  const {
    summary, summaryLoading, summaryError,
    transactions, txLoading, txError,
    pagination, filters, updateFilter, resetFilters,
  } = useWallet({
    fetchSummary: stableFetchSummary,
    fetchTransactions: stableFetchTransactions,
  });

  const totalPages = Math.ceil(pagination.count / filters.page_size);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">My Wallet</h1>
          <p className="text-sm text-gray-500 mt-0.5">Balance and transaction history</p>
        </div>
      </div>

      {/* Summary */}
      {summaryLoading && <div className="text-sm text-gray-400 mb-6">Loading balance...</div>}
      {summaryError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
          {summaryError}
        </div>
      )}
      {summary && <SummaryCards summary={summary} />}

      {/* Transactions card */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium">Transactions</h2>
          {!txLoading && (
            <span className="text-xs text-gray-400">{pagination.count} total</span>
          )}
        </div>

        <FilterBar filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} />

        {txError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
            {txError}
          </div>
        )}

        {txLoading ? (
          <div className="text-sm text-gray-400 text-center py-10">Loading transactions...</div>
        ) : (
          <TransactionTable transactions={transactions} />
        )}

        {/* Pagination */}
        {!txLoading && pagination.count > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm">
            <span className="text-gray-400 text-xs">
              Page {filters.page} of {totalPages} · {pagination.count} results
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => updateFilter("page", filters.page - 1)}
                disabled={!pagination.previous}
                className="h-8 px-3 text-xs border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50"
              >
                ← Prev
              </button>
              <button
                onClick={() => updateFilter("page", filters.page + 1)}
                disabled={!pagination.next}
                className="h-8 px-3 text-xs border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}