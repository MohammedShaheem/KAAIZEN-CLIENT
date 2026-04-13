import api from "@/api/axios";

const BASE = "/api/admin/wallet";

// ─── Admin's Own Wallet ───────────────────────────────────────────────────────

/**
 * GET /api/admin/wallet/summary/
 * Admin's own wallet balance + lifetime credited/debited totals.
 */
export const getAdminWalletSummary = async () => {
  try {
    const response = await api.get(`${BASE}/summary/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch admin wallet summary"
    );
  }
};

/**
 * GET /api/admin/wallet/transactions/
 * Paginated list of admin wallet's own transactions.
 *
 * @param {Object} params
 * @param {string}  [params.entry_type]       - "credit" | "debit"
 * @param {string}  [params.transaction_type] - e.g. "session_platform_fee"
 * @param {string}  [params.status]           - "pending" | "success" | "failed"
 * @param {string}  [params.date_from]        - "YYYY-MM-DD"
 * @param {string}  [params.date_to]          - "YYYY-MM-DD"
 * @param {string}  [params.search]           - free-text search
 * @param {string}  [params.ordering]         - e.g. "-created_at"
 * @param {number}  [params.page]             - page number (default 1)
 * @param {number}  [params.page_size]        - items per page (default 20)
 */
export const getAdminTransactions = async (params = {}) => {
  try {
    const response = await api.get(`${BASE}/transactions/`, { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch admin transactions"
    );
  }
};

/**
 * GET /api/admin/wallet/revenue/monthly/?year=2025
 * Month-by-month platform fee revenue for a given year.
 *
 * @param {number} year - e.g. 2025
 */
export const getMonthlyRevenue = async (year) => {
  try {
    const response = await api.get(`${BASE}/revenue/monthly/`, {
      params: { year },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch monthly revenue"
    );
  }
};

// ─── Platform-Wide Wallet Views ───────────────────────────────────────────────

/**
 * GET /api/admin/wallet/platform/overview/
 * Aggregated balances split by role + platform transaction volumes.
 */
export const getPlatformWalletOverview = async () => {
  try {
    const response = await api.get(`${BASE}/platform/overview/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch platform wallet overview"
    );
  }
};

/**
 * GET /api/admin/wallet/users/
 * Paginated list of all user wallets across every role.
 *
 * @param {Object} params
 * @param {string}  [params.role]      - "client" | "trainer" | "admin"
 * @param {boolean} [params.is_active] - true | false
 * @param {string}  [params.search]    - email / name
 * @param {string}  [params.ordering]  - "balance" | "-balance" | "created_at"
 * @param {number}  [params.page]
 * @param {number}  [params.page_size]
 */
export const getAllUserWallets = async (params = {}) => {
  try {
    const response = await api.get(`${BASE}/users/`, { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch user wallets"
    );
  }
};

/**
 * GET /api/admin/wallet/users/<wallet_id>/
 * Full detail for a single wallet including aggregate stats.
 *
 * @param {string} walletId - UUID of the wallet
 */
export const getUserWalletDetail = async (walletId) => {
  try {
    const response = await api.get(`${BASE}/users/${walletId}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch wallet detail"
    );
  }
};

// ─── Write Operations ─────────────────────────────────────────────────────────

/**
 * PATCH /api/admin/wallet/users/<wallet_id>/toggle-status/
 * Activate or deactivate a wallet. Cannot be used on the admin's own wallet.
 *
 * @param {string} walletId - UUID of the wallet to toggle
 */
export const toggleWalletStatus = async (walletId) => {
  try {
    const response = await api.patch(
      `${BASE}/users/${walletId}/toggle-status/`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to toggle wallet status"
    );
  }
};