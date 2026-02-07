import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchTrainerVerificationDetail,
  verifyTrainer,
} from "@/services/admin/admin";
import CertificateModal from "@/components/admin/ui/CertificateModal";

export default function TrainerVerificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  // ✅ confirmation state
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // true | false

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
    return (
      <div className="flex justify-center items-center h-64">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center">
        {error}
      </div>
    );

  if (!trainer)
    return (
      <div className="text-gray-500 text-center">
        Trainer not found.
      </div>
    );

  const handleVerify = async () => {
    try {
      await verifyTrainer(id, confirmAction);
      navigate("/admin/trainers/verification");
    } catch (err) {
      console.error("Verification failed:", err);
      alert("Failed to update verification status.");
    }
  };

  return (
    <>
      <div className="space-y-3 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold">
          {trainer.full_name}
        </h2>

        <p>
          <strong>Email:</strong> {trainer.email}
        </p>
        <p>
          <strong>Gender:</strong> {trainer.gender}
        </p>
        <p>
          <strong>Bio:</strong> {trainer.bio || "—"}
        </p>
        <p>
          <strong>Skills:</strong>{" "}
          {trainer.skills?.length
            ? trainer.skills.join(", ")
            : "—"}
        </p>

        <button
          onClick={() => setShowCertificate(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          View Experience Certificate
        </button>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => {
              setConfirmAction(true);
              setShowConfirm(true);
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Verify Trainer
          </button>

          <button
            onClick={() => {
              setConfirmAction(false);
              setShowConfirm(true);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Reject Trainer
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          url={trainer.experience_certificate}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* ✅ Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg space-y-4">
            <h3 className="text-lg font-semibold">
              Confirm Action
            </h3>

            <p className="text-sm text-gray-600">
              Are you sure you want to{" "}
              <strong>
                {confirmAction ? "verify" : "reject"}
              </strong>{" "}
              this trainer?
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmAction(null);
                }}
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false);
                  handleVerify();
                }}
                className={`px-4 py-2 rounded text-white ${
                  confirmAction
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
