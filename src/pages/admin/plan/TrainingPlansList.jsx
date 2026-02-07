import { useState, useMemo } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import ClientInput from "@/components/client/inputs/ClientInput";
import { useQuery } from "@tanstack/react-query";
import { getPlan } from "@/services/admin/personaltraining/PersonalTraining";

const ITEMS_PER_PAGE = 10;

const TrainingPlansList = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ------------------------------
  // Fetch plans (React Query)
  // ------------------------------
  const {
    data: plans = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminTrainingPlans"],
    queryFn: getPlan,
    staleTime: 1000 * 60 * 5,
  });

  // ------------------------------
  // Search filter
  // ------------------------------
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) =>
      plan.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [plans, searchTerm]);

  // Reset page on search
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ------------------------------
  // Pagination
  // ------------------------------
  const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);

  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPlans.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPlans, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // ------------------------------
  // Row click handler
  // ------------------------------
  const handleRowClick = (planId) => {
    navigate(`plandetail/${planId}`);
  };

  // ------------------------------
  // Loading state
  // ------------------------------
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // ------------------------------
  // Error state
  // ------------------------------
  if (isError) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-red-600 font-medium">
          {error?.response?.data?.detail ||
            error?.message ||
            "Failed to fetch training plans"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Training Plans
          </h2>

          <Link
            to="addplans"
            className="inline-flex items-center justify-center py-2 px-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            Add New Plan
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <ClientInput
            icon={Search}
            label="Search by Plan Name"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter plan name..."
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Duration (Days)
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Active
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Active Subscriptions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedPlans.length > 0 ? (
                paginatedPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    onClick={() => handleRowClick(plan.id)}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {plan.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {plan.duration_days}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{Number(plan.price).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {plan.description || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {plan.is_active ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                          No
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {plan.active_subscriptions}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-sm text-gray-500 text-center"
                  >
                    No plans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded-xl disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded-xl disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Nested routes render here */}
      <Outlet />
    </>
  );
};

export default TrainingPlansList;
