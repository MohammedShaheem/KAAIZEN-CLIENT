import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrainers } from "@/services/admin/admin";

export default function TrainerList() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainers()
      .then((res) => {
        setTrainers(res.data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch trainers:", err);
        setError("Failed to load trainers.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {trainers.map((trainer) => (
            <tr
              key={trainer.id}
              onClick={() => navigate(`/admin/trainers/${trainer.id}`)}
              className="cursor-pointer hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {trainer.email}
              </td>

              <td className="px-6 py-4 text-sm">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    trainer.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {trainer.is_active ? "Active" : "Blocked"}
                </span>
              </td>

              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(trainer.created_at).toDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {trainers.length === 0 && (
        <p className="text-gray-500 text-center py-8">No trainers found.</p>
      )}
    </div>
  );
}
