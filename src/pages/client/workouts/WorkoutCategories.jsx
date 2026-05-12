import { useState } from "react";
import { useWorkoutCategories } from "@/hooks/client/workout/useWorkout";
import { useNavigate } from "react-router-dom";
import { useClientProfile } from "@/hooks/client/dashboard/useClientProfile";
import ClientLayout from "@/components/client/layout/ClientLayout";

export default function WorkoutCategories() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useWorkoutCategories(page);
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorData,
    refetch: refetchProfile,
  } = useClientProfile();
  console.log("from categorys",data);

  if (isLoading) {
    return <div className="p-4">Loading categories...</div>;
  }


  

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error: {error?.response?.data?.message || "Failed to load categories"}
      </div>
    );
  }
  
  

  return (
    <ClientLayout headerProps={{location: "Workout Category" }}>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Workout Categories</h1>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.results.map((category) => (
          <div
            key={category.id}
            className="p-4 border rounded-lg shadow cursor-pointer hover:bg-gray-100 transition"
            onClick={() =>
              navigate(`/client/category_detail/${category.id}`)
            }   
> 
            <h2 className="text-lg font-semibold">
              {category.name}
            </h2>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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
