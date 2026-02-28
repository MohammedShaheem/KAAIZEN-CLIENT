import { useState } from "react";
import { useWorkouts,useCreateWorkout } from "@/hooks/admin/useWorkouts";
import { useNavigate } from "react-router-dom";
import WorkoutVideoForm from "@/components/admin/workout/WorkoutVideoForm";

export default function AdminWorkoutVideoList() {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const navigate = useNavigate()


  const {
    data,
    isLoading,
    isError,
  } = useWorkouts(currentPage);

  const createWorkoutMutation = useCreateWorkout();



  const videos = data?.data?.results || [];

  const totalPages = Math.ceil(videos.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedVideos = videos.slice(startIndex, endIndex);

 

  const handleCreate = (formData) => {
    createWorkoutMutation.mutate(formData, {
      onSuccess: () => {
        setShowModal(false);
        setCurrentPage(1);
      },
      onError: () => {
        alert("Failed to create workout video");
      },
    });
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Failed to load workout videos
      </div>
    );
  }

 

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Workout Videos</h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          + Add Workout Video
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Created
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {paginatedVideos.length > 0 ? (
              paginatedVideos.map((video) => (
                <tr
                  key={video.id}
                  onClick={() => navigate(`/admin/workouts/${video.id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {video.title}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {video.duration_seconds}s
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(video.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                  No workout videos found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {videos.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(endIndex, videos.length)} of {videos.length} videos
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Add Workout Video
            </h2>

            <WorkoutVideoForm
              onSubmit={handleCreate}
              submitting={createWorkoutMutation.isPending}
            />

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}