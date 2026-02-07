import { useTrainerSessions } from "@/hooks/trainer/personaltraining/useTrainerSessions";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/trainer/ui/sidebar";

const TrainerSessionsPage = () => {
  const { data, isLoading, isError } = useTrainerSessions();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="p-6">Loading sessions…</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load sessions
      </div>
    );
  }

  const { recent_sessions = [], all_sessions = [] } = data;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-10">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Sessions
          </h1>
          <p className="text-sm text-slate-500">
            View and manage your training sessions
          </p>
        </div>

        {/* Upcoming Sessions */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Upcoming Sessions
          </h2>

          {recent_sessions.length === 0 ? (
            <p className="text-sm text-slate-500">
              No upcoming sessions
            </p>
          ) : (
            <div className="space-y-3">
              {recent_sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() =>
                    navigate(`/trainer/sessions/${s.id}`)
                  }
                  className="cursor-pointer p-4 rounded-lg border hover:bg-slate-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-800">
                        {s.client_name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {s.session_date} · {s.start_time} – {s.end_time}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      Upcoming
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All Sessions */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            All Sessions
          </h2>

          <div className="space-y-3">
            {all_sessions.map((s) => (
              <div
                key={s.id}
                onClick={() =>
                  navigate(`/trainer/sessions/${s.id}`)
                }
                className="cursor-pointer p-4 rounded-lg border hover:bg-slate-50 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">
                      {s.client_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {s.session_date} · {s.start_time} – {s.end_time}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrainerSessionsPage;
