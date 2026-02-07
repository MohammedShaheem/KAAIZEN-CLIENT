import { useParams } from "react-router-dom";
import { useTrainerSessionDetail } from "@/hooks/trainer/personaltraining/useTrainerSessions";
import Sidebar from "@/components/trainer/ui/sidebar";

const TrainerSessionDetailPage = () => {
  const { sessionId } = useParams();
  const { data, isLoading, isError } =
    useTrainerSessionDetail(sessionId);

  if (isLoading) {
    return <div className="p-6">Loading session…</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load session details
      </div>
    );
  }

  const {
    client,
    active_plan,
    session_date,
    start_time,
    end_time,
    status,
  } = data;

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      
      <Sidebar />

      
      <main className="flex-1 p-8 space-y-8">
        
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Session Details
          </h1>
          <p className="text-sm text-slate-500">
            Detailed overview of the session
          </p>
        </div>

        
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Session Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p>
              <span className="text-slate-500">Date:</span>{" "}
              <span className="font-medium">{session_date}</span>
            </p>
            <p>
              <span className="text-slate-500">Time:</span>{" "}
              <span className="font-medium">
                {start_time} – {end_time}
              </span>
            </p>
            <p>
              <span className="text-slate-500">Status:</span>{" "}
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                {status}
              </span>
            </p>
          </div>
        </section>

        
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Client Details
          </h2>

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">Name:</span>{" "}
              <span className="font-medium">{client.full_name}</span>
            </p>
            <p>
              <span className="text-slate-500">Email:</span>{" "}
              <span className="font-medium">{client.email}</span>
            </p>
            <p>
              <span className="text-slate-500">Gender:</span>{" "}
              <span className="font-medium">{client.gender}</span>
            </p>
          </div>
        </section>

        
        {active_plan && (
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Active Plan
            </h2>

            <div className="space-y-2 text-sm">
              <p className="font-medium">{active_plan.plan_name}</p>
              <p className="text-slate-500">
                {active_plan.start_date} → {active_plan.end_date}
              </p>
              <p>
                Sessions / week:{" "}
                <span className="font-medium">
                  {active_plan.sessions_per_week}
                </span>
              </p>
            </div>
          </section>
        )}
      </main>

      
      <button
        className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-900 transition"
      >
        Start Session
      </button>
    </div>
  );
};

export default TrainerSessionDetailPage;
