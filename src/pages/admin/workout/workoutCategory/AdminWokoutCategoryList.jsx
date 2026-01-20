import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWorkoutCategories,createWorkoutCategory } from "@/services/admin/workouts/workoutcategory";

export default function AdminWorkoutCategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkoutCategories()
      .then((res) => {
        setCategories(res.data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load workout categories.");
        setLoading(false);
      });
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      setSubmitting(true);
      const res = await createWorkoutCategory({ name: newCategory });
      setCategories((prev) => [res.data, ...prev]);
      setNewCategory("");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create category:", err);
      alert("Category already exists or invalid.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="flex justify-center items-center h-64">Loading...</div>;

  if (error)
    return <div className="text-red-500 text-center">{error}</div>;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Workout Categories
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#7B1FA2] text-white rounded hover:bg-[#6a1b9a]"
        >
          + Create Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-gray-50 transition cursor-pointer"
                onClick={() =>
                  navigate(`/admin/workouts/categories/${category.id}`)
                }
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {category.name}
                </td>

                <td
                  className="px-6 py-4 text-sm text-gray-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    onClick={() => navigate("/admin/workouts/workoutvideos")}
                    className="text-indigo-600 hover:underline cursor-pointer"
                  >
                    View Videos →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No workout categories found.
          </p>
        )}
      </div>

      {/* Create Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Create Workout Category
            </h2>

            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateCategory}
                disabled={submitting}
                className="px-4 py-2 bg-[#7B1FA2] text-white rounded disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
