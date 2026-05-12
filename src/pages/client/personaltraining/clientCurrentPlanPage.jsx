import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useClientCurrentPlan } from "@/hooks/client/personaltraining/publicPlan";
import { useCancelSession } from "@/hooks/client/personaltraining/publicPlan";
import { Spinner } from "@/components/common/Spinner";
import ClientLayout from "@/components/client/layout/ClientLayout";

const PAGE_SIZE = 5;
const MAX_CANCELLATIONS = 2;
const REFUND_CUTOFF_HOURS = 24;



const hoursUntil = (sessionDate, startTime) => {
  const sessionDt = new Date(`${sessionDate}T${startTime}`);
  return (sessionDt - new Date()) / 3_600_000;
};

const isRefundEligible = (session, cancellationsUsed) => {
  if (cancellationsUsed >= MAX_CANCELLATIONS) return false;
  return hoursUntil(session.session_date, session.start_time) >= REFUND_CUTOFF_HOURS;
};

const statusLabel = (status) => {
  const map = {
    scheduled: "Scheduled",
    completed: "Completed",
    canceled_early: "Canceled (refunded)",
    canceled_late: "Canceled (no refund)",
    cancelled_by_system: "Canceled by system",
  };
  return map[status] ?? status;
};

const statusStyle = (status) => {
  if (status === "scheduled") return "bg-blue-100 text-blue-700";
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "canceled_early") return "bg-yellow-100 text-yellow-700";
  if (status === "canceled_late" || status === "cancelled_by_system")
    return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-600";
};


const CancelModal = ({ session, cancellationsUsed, onConfirm, onClose, isPending }) => {
  const eligible = isRefundEligible(session, cancellationsUsed);
  const overLimit = cancellationsUsed >= MAX_CANCELLATIONS;
  const hours = hoursUntil(session.session_date, session.start_time);
  const remaining = Math.max(0, MAX_CANCELLATIONS - cancellationsUsed);

  const reasonText = overLimit
    ? `You've used all ${MAX_CANCELLATIONS} free cancellations this month — no refund will be issued.`
    : hours < REFUND_CUTOFF_HOURS
    ? "This session is less than 24 hours away — canceling now will not be refunded."
    : `You have ${remaining} free cancellation${remaining !== 1 ? "s" : ""} left. The session amount will be credited to your wallet.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Cancel this session?
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {session.session_date} · {session.start_time} – {session.end_time}
        </p>

        <div
          className={`rounded-xl p-3 mb-4 text-sm ${
            eligible
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <p className={`font-medium mb-0.5 ${eligible ? "text-green-700" : "text-red-700"}`}>
            {eligible ? "Refund eligible" : "No refund"}
          </p>
          <p className={eligible ? "text-green-600" : "text-red-600"}>{reasonText}</p>
        </div>

        <div className="divide-y divide-gray-100 mb-5 text-sm">
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Session price</span>
            <span className="font-medium">
              {session.session_price ? `₹${session.session_price}` : "—"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Wallet credit</span>
            <span className={`font-medium ${eligible ? "text-green-600" : "text-gray-400"}`}>
              {eligible && session.session_price ? `+₹${session.session_price}` : "₹0"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Cancellations used after</span>
            <span className="font-medium">
              {Math.min(cancellationsUsed + 1, MAX_CANCELLATIONS)} / {MAX_CANCELLATIONS}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 transition"
          >
            {isPending ? "Canceling…" : "Confirm cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};


const ResultModal = ({ result, onClose }) => {
  const { refund_eligible, cancellations_used, remaining_cancellations, session_price } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
        <div
          className={`mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium ${
            refund_eligible ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {refund_eligible ? "✓" : "!"}
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {refund_eligible ? "Session canceled & refunded" : "Session canceled"}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {refund_eligible
            ? "The session amount has been credited to your wallet."
            : "No refund was issued for this cancellation."}
        </p>
        {refund_eligible && session_price && (
          <p className="text-2xl font-semibold text-green-600 mb-1">+₹{session_price}</p>
        )}
        <p className="text-xs text-gray-400 mb-5">
          Cancellations this month: {cancellations_used} / {MAX_CANCELLATIONS} ·{" "}
          {remaining_cancellations} remaining
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};


const ClientCurrentPlanPage = () => {
  const { data, isLoading, isError, error } = useClientCurrentPlan();
  const { mutate: cancelSession, isPending } = useCancelSession();

  const [page, setPage] = useState(1);
  const [confirmingSession, setConfirmingSession] = useState(null);
  const [resultData, setResultData] = useState(null);
  // Track locally so the quota pips update immediately without waiting for refetch
  const [cancellationsUsed, setCancellationsUsed] = useState(0);

  const navigate = useNavigate();

  const handleCancelClick = (session) => setConfirmingSession(session);

  const handleConfirmCancel = () => {
    cancelSession(confirmingSession.id, {
      onSuccess: (result) => {
        setResultData({ ...result, session_price: confirmingSession.session_price });
        setCancellationsUsed(result.cancellations_used);
        setConfirmingSession(null);
      },
      onError: (err) => {
        alert(err.message || "Cancellation failed. Please try again.");
        setConfirmingSession(null);
      },
    });
  };


  if (isLoading) {
    return (
      <div className="p-6">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    if (error?.response?.status === 404) {
      return <div className="p-6 text-gray-600">You don't have an active training plan yet.</div>;
    }
    return <div className="p-6 text-red-500">Something went wrong.</div>;
  }

  if (!data?.plan) {
    return (
      <ClientLayout headerProps={{ userName: "Client", location: "Training Plans" }}>
        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold mb-2">No Active Plan</h2>
            <p className="text-gray-600">You don't have an active training plan yet.</p>
          </div>
        </div>
      </ClientLayout>
    );
  }


  const { plan, trainer, assignment, sessions = [] } = data;

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.session_date) - new Date(b.session_date)
  );

  const upcomingSession = sortedSessions.find((s) => s.status === "scheduled");
  const completedCount = sortedSessions.filter((s) => s.status === "completed").length;
  const progressPercent = sortedSessions.length
    ? Math.round((completedCount / sortedSessions.length) * 100)
    : 0;

  const paginatedSessions = sortedSessions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const totalPages = Math.ceil(sortedSessions.length / PAGE_SIZE);
  const remaining = Math.max(0, MAX_CANCELLATIONS - cancellationsUsed);

  return (
    <ClientLayout headerProps={{ userName: "Client", location: "Training Plans" }}>
      {/* Modals */}
      {confirmingSession && (
        <CancelModal
          session={confirmingSession}
          cancellationsUsed={cancellationsUsed}
          onConfirm={handleConfirmCancel}
          onClose={() => setConfirmingSession(null)}
          isPending={isPending}
        />
      )}
      {resultData && <ResultModal result={resultData} onClose={() => setResultData(null)} />}

      <div className="p-6 space-y-6">
        {/* Plan + Trainer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Your Plan</h2>
            <p className="text-lg font-medium">{plan.full_name}</p>
            <p className="text-sm text-gray-600">{plan.description}</p>
            <div className="mt-4 text-sm space-y-1">
              <p>Duration: {plan.duration_weeks} weeks</p>
              <p>Price: ₹{plan.price}</p>
              <p>
                Preferred Time: {assignment.preferred_start_time} – {assignment.preferred_end_time}
              </p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-2 bg-green-500 rounded" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Your Trainer</h2>
            <p className="text-lg font-medium">{trainer.full_name}</p>
            <p className="text-sm text-gray-600">{trainer.bio}</p>
            <div className="mt-4 text-sm space-y-1">
              <p>Experience: {trainer.experience_years ?? "—"} years</p>
              <p>Rating: {trainer.rating}</p>
              <p>Verified: {trainer.is_verified ? "Yes" : "No"}</p>
            </div>
            <div className="mt-5">
              <button className="px-4 py-2 text-sm rounded bg-blue-600 text-white">
                Request to Change Trainer
              </button>
            </div>
          </div>
        </div>

        {/* Next session banner */}
        {upcomingSession && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-blue-800">Next Session</p>
              <p className="text-sm">
                {upcomingSession.session_date} · {upcomingSession.start_time} –{" "}
                {upcomingSession.end_time}
              </p>
            </div>
            <button
              onClick={() => navigate(`/sessions/${upcomingSession.id}/video`)}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Start Session
            </button>
          </div>
        )}

        {/* Session list */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Sessions</h2>

            {/* Monthly cancellation quota indicator */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {Array.from({ length: MAX_CANCELLATIONS }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i < cancellationsUsed ? "bg-red-400" : "bg-green-400"
                    }`}
                    title={i < cancellationsUsed ? "Used" : "Available"}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {remaining} cancellation{remaining !== 1 ? "s" : ""} left this month
              </span>
            </div>
          </div>

          {paginatedSessions.map((session) => {
            const isScheduled = session.status === "scheduled";
            const eligible = isRefundEligible(session, cancellationsUsed);

            return (
              <div key={session.id} className="py-4 border-b last:border-b-0 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{session.session_date}</p>
                    <p className="text-sm text-gray-500">
                      {session.start_time} – {session.end_time}
                    </p>
                    {session.session_price && (
                      <p className="text-xs text-gray-400 mt-0.5">₹{session.session_price}</p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle(
                      session.status
                    )}`}
                  >
                    {statusLabel(session.status)}
                  </span>
                </div>

                {isScheduled && (
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs ${
                        eligible ? "text-green-600" : "text-orange-500"
                      }`}
                    >
                      {eligible
                        ? "Refund eligible if canceled"
                        : cancellationsUsed >= MAX_CANCELLATIONS
                        ? "No refund — monthly limit reached"
                        : "No refund — within 24 hrs of session"}
                    </span>
                    <button
                      onClick={() => handleCancelClick(session)}
                      disabled={isPending}
                      className="px-3 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                    >
                      Cancel Session
                    </button>
                  </div>
                )}
              </div>
            );
          })}

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