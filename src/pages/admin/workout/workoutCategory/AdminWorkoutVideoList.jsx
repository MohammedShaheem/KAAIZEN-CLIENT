import { useEffect, useState } from "react";
import { fetchWorkouts,createWorkout } from "@/services/admin/workouts/workoutvideos";
import WorkoutVideoForm from "@/components/admin/workout/WorkoutVideoForm";

export default function AdminWorkoutVideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkouts()
      .then((res) => {
        setVideos(res.data.results || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleCreate = async (data) => {
    try {
      setSubmitting(true);
      const res = await createWorkout(data);
      setVideos((prev) => [res.data, ...prev]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create workout video");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="flex justify-center h-64">Loading...</div>;

  return (
    <>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Workout Videos</h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#7B1FA2] text-white rounded"
        >
          + Add Workout Video
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Duration</th>
              <th className="px-6 py-3 text-left">Created</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {videos.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{v.title}</td>
                <td className="px-6 py-4">
                  {v.duration_seconds}s
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(v.created_at).toDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-lg font-semibold mb-4">
              Add Workout Video
            </h2>

            <WorkoutVideoForm
              onSubmit={handleCreate}
              submitting={submitting}
            />

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
