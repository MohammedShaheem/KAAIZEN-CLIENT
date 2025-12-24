import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchClientDetail,updateUserStatus } from "@/services/admin";

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    fetchClientDetail(id).then(res => setClient(res.data));
  }, [id]);

  if (!client) return <p>Loading...</p>;

  const toggleStatus = async () => {
    await updateUserStatus(id, !client.is_active);
    setClient({ ...client, is_active: !client.is_active });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">{client.full_name}</h2>

      <p>Email: {client.email}</p>
      <p>Gender: {client.gender}</p>
      <p>Height: {client.height_cm} cm</p>
      <p>Weight: {client.weight_kg} kg</p>
      <p>Fitness Goal: {client.fitness_goal}</p>
      <p>Daily Calories: {client.target_daily_calories}</p>
      <p>Water Goal: {client.water_goal_ml} ml</p>

      <button
        onClick={toggleStatus}
        className={`px-4 py-2 rounded ${
          client.is_active ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        {client.is_active ? "Block User" : "Unblock User"}
      </button>
    </div>
  );
}
