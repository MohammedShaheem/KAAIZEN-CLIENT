import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTrainerVerificationDetail,verifyTrainer } from "@/services/admin/admin";
import CertificateModal from "@/components/admin/ui/CertificateModal";

export default function TrainerVerificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    fetchTrainerVerificationDetail(id)
      .then((res) => {
        setTrainer(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch trainer detail:", err);
        setError("Failed to load trainer details.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div className="flex justify-center items-center h-64">Loading...</div>;

  if (error)
    return <div className="text-red-500 text-center">{error}</div>;

  if (!trainer)
    return <div className="text-gray-500 text-center">Trainer not found.</div>;

  const handleVerify = async (approve) => {
    try {
      await verifyTrainer(id, approve);
      navigate("/admin/trainers/verification");
    } catch (err) {
      console.error("Verification failed:", err);
      alert("Failed to update verification status.");
    }
  };

  return (
    <>
      <div className="space-y-3 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold">{trainer.full_name}</h2>

        <p><strong>Email:</strong> {trainer.email}</p>
        <p><strong>Gender:</strong> {trainer.gender}</p>
        <p><strong>Bio:</strong> {trainer.bio || "—"}</p>
        <p>
          <strong>Skills:</strong>{" "}
          {trainer.skills?.length ? trainer.skills.join(", ") : "—"}
        </p>

        <button
          onClick={() => setShowCertificate(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          View Experience Certificate
        </button>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => handleVerify(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Verify Trainer
          </button>

          <button
            onClick={() => handleVerify(false)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Reject Trainer
          </button>
        </div>
      </div>

      {showCertificate && (
        <CertificateModal
          url={trainer.experience_certificate}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </>
  );
}
