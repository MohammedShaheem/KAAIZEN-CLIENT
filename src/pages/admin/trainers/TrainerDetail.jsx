import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTrainerDetail,updateTrainerStatus } from "@/services/admin/admin";

export default function TrainerDetail() {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainerDetail(id)
      .then((res) => {
        setTrainer(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch trainer:", err);
        setError("Failed to load trainer details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!trainer) {
    return <div className="text-gray-500 text-center">Trainer not found.</div>;
  }

  const toggleStatus = async () => {
    try {
      await updateTrainerStatus(id, !trainer.is_active);
      setTrainer({ ...trainer, is_active: !trainer.is_active });
    } catch (err) {
      console.error("Failed to update trainer status:", err);
      alert("Failed to update trainer status.");
    }
  };

  return (
    <div className="space-y-3 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">{trainer.full_name}</h2>

      <p><strong>Email:</strong> {trainer.email}</p>
      <p><strong>Gender:</strong> {trainer.gender}</p>
      <p><strong>Experience:</strong> {trainer.experience_years} years</p>
      <p><strong>Specialization:</strong> {trainer.specialization}</p>
      <p><strong>Certifications:</strong> {trainer.certifications || "N/A"}</p>

      <button
        onClick={toggleStatus}
        className={`px-4 py-2 rounded text-white transition ${
          trainer.is_active
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {trainer.is_active ? "Block Trainer" : "Unblock Trainer"}
      </button>
    </div>
  );
}
