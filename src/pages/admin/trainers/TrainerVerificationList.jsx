import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPendingTrainerVerifications } from "@/services/admin/admin";

export default function TrainerVerificationList() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingTrainerVerifications()
      .then((res) => {
        setTrainers(res.data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch trainer verifications:", err);
        setError("Failed to load verification requests.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="flex justify-center items-center h-64">Loading...</div>;

  if (error)
    return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Skills
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Submitted
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {trainers.map((trainer) => (
            <tr
              key={trainer.id}
              onClick={() =>
                navigate(trainer.id)
              }
              className="cursor-pointer hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {trainer.email}
              </td>

              <td className="px-6 py-4 text-sm text-gray-500">
                {trainer.skills?.length
                  ? trainer.skills.join(", ")
                  : "—"}
              </td>

              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(trainer.created_at).toDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {trainers.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No pending trainer verification requests.
        </p>
      )}
    </div>
  );
}
