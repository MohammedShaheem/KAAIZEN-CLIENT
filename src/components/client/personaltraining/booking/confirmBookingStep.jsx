import { useConfirmAssignment } from "@/hooks/client/personaltraining/publicPlan";
import { useNavigate } from "react-router-dom";

const ConfirmBookingStep = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useConfirmAssignment();

  const handleConfirm = () => {
    mutate(undefined, {
      onSuccess: () => {
        navigate("/current-plan");
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Confirm Booking</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl mb-6 border-2 border-purple-100">
        <p className="text-gray-700 text-center mb-2">
          <span className="text-2xl">✓</span>
        </p>
        <p className="text-gray-600 text-center text-sm">
          Review your selections and confirm to complete your booking
        </p>
      </div>

      <button
        onClick={handleConfirm}
        disabled={isPending}
        className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isPending
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg hover:from-purple-700 hover:to-purple-600"
        }`}
      >
        {isPending ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          "Confirm Assignment"
        )}
      </button>

      <p className="text-center text-xs text-gray-500 mt-4">
        Once confirmed, your booking cannot be modified
      </p>
    </div>
  );
};

export default ConfirmBookingStep;
