import { useState, useEffect, useCallback } from "react";

export function useWallet({ fetchSummary, fetchTransactions }) {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);
  const [txError, setTxError] = useState(null);

  const [filters, setFilters] = useState({
    entry_type: "",
    status: "",
    transaction_type: "",
    date_from: "",
    date_to: "",
    amount_min: "",
    amount_max: "",
    ordering: "-created_at",
    page: 1,
    page_size: 10,
  });

  useEffect(() => {
    setSummaryLoading(true);
    setSummaryError(null);
    fetchSummary()
      .then(setSummary)
      .catch((e) => setSummaryError(e.message))
      .finally(() => setSummaryLoading(false));
  }, [fetchSummary]);

  const loadTransactions = useCallback(() => {
    setTxLoading(true);
    setTxError(null);
    // strip empty params before sending
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "")
    );
    fetchTransactions(cleaned)
      .then((data) => {
        setTransactions(data.results);
        setPagination({ count: data.count, next: data.next, previous: data.previous });
      })
      .catch((e) => setTxError(e.message))
      .finally(() => setTxLoading(false));
  }, [filters, fetchTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== "page" ? 1 : value }));

  const resetFilters = () =>
    setFilters({
      entry_type: "",
      status: "",
      transaction_type: "",
      date_from: "",
      date_to: "",
      amount_min: "",
      amount_max: "",
      ordering: "-created_at",
      page: 1,
      page_size: 10,
    });

  return {
    summary, summaryLoading, summaryError,
    transactions, txLoading, txError,
    pagination, filters, updateFilter, resetFilters,
  };
}