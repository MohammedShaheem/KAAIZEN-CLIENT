import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoryDetail } from "@/hooks/client/workout/useWorkout";
import ClientLayout from "@/components/client/layout/ClientLayout";
export default function CategoryDetail() {
  const { categoryId } = useParams();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useCategoryDetail(categoryId, page);
  console.log("category_id from categorydetal",categoryId);
  
  console.log("data from category details",data);
  
  

  if (isLoading) {
    return <div className="p-4">Loading workouts...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error: {error?.response?.data?.message || "Failed to load workouts"}
      </div>
    );
  }

  return (
    <ClientLayout>
    <div className="p-6">
      {/* Category Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-500 mb-2"
        >
          ← Back to categories
        </button>

        {/* <h1 className="text-2xl font-bold">
          {data.category.name}
        </h1> */}
      </div>

      {/* workout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.results.map((workout) => (
          <div
            key={workout.id}
            className="p-4 border rounded-lg shadow cursor-pointer hover:bg-gray-100 transition"
            onClick={() =>
                    navigate(`/client/workouts/${workout.id}`, {
                      state: {
                        playlist: data.results,
                        startIndex: data.results.findIndex(
                          (w) => w.id === workout.id
                        ),
                        categoryId,
                      },
                    })
                  }


          >
            <h2 className="font-semibold">
              {workout.title}
            </h2>

            {workout.duration_seconds && (
              <p className="text-sm text-gray-500">
                Duration: {workout.duration_seconds} min
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          disabled={!data.previous}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {page}
          {isFetching && " • Updating..."}
        </span>

        <button
          disabled={!data.next}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    </ClientLayout>
  );
}
