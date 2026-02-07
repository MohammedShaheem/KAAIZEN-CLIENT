import { useState } from "react";
import { useClientCurrentPlan } from "@/hooks/client/personaltraining/publicPlan";
import { Spinner } from "@/components/common/Spinner";
import ClientLayout from "@/components/client/layout/ClientLayout";

const PAGE_SIZE = 5;

const ClientCurrentPlanPage = () => {
  const { data, isLoading, isError, error } = useClientCurrentPlan();
  const [page, setPage] = useState(1);

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    if (error?.response?.status === 404) {
      return (
        <div className="p-6 text-gray-600">
          You don’t have an active training plan yet.
        </div>
      );
    }
    return <div className="p-6 text-red-500">Something went wrong.</div>;
  }

  const { plan, trainer, assignment, sessions = [] } = data;

  // ---- Sessions logic ----
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.session_date) - new Date(b.session_date)
  );

  const upcomingSession = sortedSessions.find(
    (s) => s.status === "scheduled"
  );

  const completedCount = sortedSessions.filter(
    (s) => s.status === "completed"
  ).length;

  const progressPercent = Math.round(
    (completedCount / sortedSessions.length) * 100
  );

  const paginatedSessions = sortedSessions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.ceil(sortedSessions.length / PAGE_SIZE);

  return (
    <ClientLayout
      headerProps={{
        userName: "Client",
        location: "Training Plans",
      }}
    >
      <div className="p-6 space-y-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Your Plan</h2>

            <p className="text-lg font-medium">{plan.full_name}</p>
            <p className="text-sm text-gray-600">{plan.description}</p>

            <div className="mt-4 text-sm space-y-1">
              <p>Duration: {plan.duration_weeks} weeks</p>
              <p>Price: ₹{plan.price}</p>
              <p>
                Preferred Time: {assignment.preferred_start_time} –{" "}
                {assignment.preferred_end_time}
              </p>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-green-500 rounded"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Trainer */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Your Trainer</h2>

            <p className="text-lg font-medium">{trainer.full_name}</p>
            <p className="text-sm text-gray-600">{trainer.bio}</p>

            <div className="mt-4 text-sm space-y-1">
              <p>Experience: {trainer.experience_years ?? "—"} years</p>
              <p>Rating: {trainer.rating}</p>
              <p>Verified: {trainer.is_verified ? "Yes" : "No"}</p>
            </div>

            <div className="mt-5 flex gap-3">
              <button className="px-4 py-2 text-sm rounded bg-blue-600 text-white">
                Request to Change Trainer
              </button>
            </div>
          </div>
        </div>

        {/* Next Session */}
        {upcomingSession && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="font-medium text-blue-800">Next Session</p>
            <p className="text-sm">
              {upcomingSession.session_date} ·{" "}
              {upcomingSession.start_time} – {upcomingSession.end_time}
            </p>
          </div>
        )}

        {/* All Sessions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">All Sessions</h2>

          {paginatedSessions.map((session) => (
            <div
              key={session.id}
              className="py-4 border-b last:border-b-0 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{session.session_date}</p>
                  <p className="text-sm text-gray-500">
                    {session.start_time} – {session.end_time}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                  {session.status}
                </span>
              </div>

              {/* ✅ Added controls */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  Used 0 out of 4
                </span>

                <button className="px-3 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50">
                  Cancel Session
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-end gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientCurrentPlanPage;
