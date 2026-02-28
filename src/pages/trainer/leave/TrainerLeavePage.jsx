import React from "react";
import { useTrainerLeaves } from "@/hooks/trainer/leave/useTrainerLeave";
import { CalendarDays, AlertCircle } from "lucide-react";

export default function TrainerLeavesPage() {
  const { data, isLoading, isError, error } = useTrainerLeaves();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-semibold mb-6">My Leaves</h1>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-2xl shadow p-6 space-y-3"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-3" size={40} />
          <h2 className="text-lg font-semibold">Failed to load leaves</h2>
          <p className="text-sm text-gray-500 mt-2">
            {error?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  const leaves = data || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Leave Requests</h1>

        {leaves.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <CalendarDays className="mx-auto text-gray-400 mb-3" size={40} />
            <p className="text-gray-600">
              You haven’t applied for any leave yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {leave.reason || "Leave Request"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {leave.start_date} → {leave.end_date}
                    </p>
                  </div>

                  <StatusBadge status={leave.status} />
                </div>

                {leave.description && (
                  <p className="text-sm text-gray-600 mt-4">
                    {leave.description}
                  </p>
                )}

                <div className="text-xs text-gray-400 mt-4">
                  Applied on:{" "}
                  {new Date(leave.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const base =
    "px-3 py-1 rounded-full text-xs font-medium capitalize";

  const styles = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span className={`${base} ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}