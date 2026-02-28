import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useWorkoutDetail,useUpdateWorkout,useDeleteWorkout } from "@/hooks/admin/useWorkouts";

import WorkoutVideoForm from "@/components/admin/workout/WorkoutVideoForm";

export default function WorkoutVideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

 

  const {
    data,
    isLoading,
    isError,
  } = useWorkoutDetail(id);

  const updateWorkoutMutation = useUpdateWorkout();
  const deleteWorkoutMutation = useDeleteWorkout();

  const workout = data?.data;

  

  const handleUpdate = (formData) => {
    updateWorkoutMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: () => {
          alert("Failed to update workout");
        },
      }
    );
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmDelete) return;

    deleteWorkoutMutation.mutate(id, {
      onSuccess: () => {
        navigate("/admin/workouts");
      },
      onError: () => {
        alert("Failed to delete workout");
      },
    });
  };

 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading workout...
      </div>
    );
  }

  if (isError || !workout) {
    return (
      <div className="text-center text-red-500">
        Failed to load workout
      </div>
    );
  }

  

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workout Detail</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteWorkoutMutation.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Detail Card */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Title</p>
          <p className="text-lg font-semibold">{workout.title}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Duration</p>
          <p>{workout.duration_seconds} seconds</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Created At</p>
          <p>
            {new Date(workout.created_at).toLocaleString()}
          </p>
        </div>

        {workout.video_url && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Video</p>
            <video
              src={workout.video_url}
              controls
              className="w-full rounded-md"
            />
          </div>
        )}
      </div>

      {/* =========================
          Edit Modal
      ========================= */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Edit Workout
            </h2>

            <WorkoutVideoForm
              initialData={workout}
              onSubmit={handleUpdate}
              submitting={updateWorkoutMutation.isPending}
            />

            <button
              onClick={() => setIsEditing(false)}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}