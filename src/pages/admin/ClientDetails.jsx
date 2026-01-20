// Corrected ClientDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchClientDetail, updateUserStatus } from "@/services/admin/admin";

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientDetail(id)
      .then((res) => {
        setClient(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch client detail:", err);
        setError("Failed to load client details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!client) return <div className="text-gray-500 text-center">Client not found.</div>;

  const toggleStatus = async () => {
    try {
      await updateUserStatus(id, !client.is_active);
      setClient({ ...client, is_active: !client.is_active });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update user status.");
    }
  };

  return (
    <div className="space-y-3 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">{client.full_name}</h2>

      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Gender:</strong> {client.gender}</p>
      <p><strong>Height:</strong> {client.height_cm} cm</p>
      <p><strong>Weight:</strong> {client.weight_kg} kg</p>
      <p><strong>Fitness Goal:</strong> {client.fitness_goal}</p>
      <p><strong>Daily Calories:</strong> {client.target_daily_calories}</p>
      <p><strong>Water Goal:</strong> {client.water_goal_ml} ml</p>

      <button
        onClick={toggleStatus}
        className={`px-4 py-2 rounded ${
          client.is_active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        } text-white transition-colors`}
      >
        {client.is_active ? "Block User" : "Unblock User"}
      </button>
    </div>
  );
}