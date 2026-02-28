import { useState, useEffect } from "react";
import { useCreateTrainerLeave } from "@/hooks/trainer/leave/useTrainerLeave";
import { Calendar, X, AlertCircle, Check } from "lucide-react";

export default function TrainerLeaveModal({ isOpen, onClose }) {
  const { mutate, isPending, error } = useCreateTrainerLeave();

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [formError, setFormError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        start_date: "",
        end_date: "",
        reason: "",
      });
      setFormError("");
      setShowConfirmation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.start_date || !formData.end_date) {
      setFormError("Start date and end date are required.");
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = () => {
    mutate(formData, {
      onSuccess: () => {
        onClose();
      },
      onError: (err) => {
        const message =
          err?.response?.data?.detail ||
          "Failed to apply leave. Please try again.";
        setFormError(message);
        setShowConfirmation(false);
      },
    });
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={headerTitleStyle}>
              <Calendar size={24} color="#4F46E5" />
              <h2 style={titleStyle}>Apply for Leave</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={closeButtonStyle}
              disabled={isPending}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formGridStyle}>
              {/* Start Date */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  Start Date <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              {/* End Date */}
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  End Date <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                  min={formData.start_date}
                />
              </div>
            </div>

            {/* Duration Info */}
            {formData.start_date && formData.end_date && (
              <div style={durationInfoStyle}>
                <div style={durationBadgeStyle}>
                  <span style={durationTextStyle}>
                    Duration: {calculateDays()} day{calculateDays() > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}

            {/* Reason */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Reason (optional)</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                style={textareaStyle}
                placeholder="Please provide a brief reason for your leave request..."
              />
            </div>

            {/* Error Message */}
            {formError && (
              <div style={errorStyle}>
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            {/* Buttons */}
            <div style={buttonContainerStyle}>
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                style={cancelButtonStyle}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                style={submitButtonStyle}
              >
                {isPending ? (
                  <>
                    <div style={spinnerStyle}></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div style={confirmOverlayStyle} onClick={handleCancelConfirmation}>
          <div
            style={confirmModalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={confirmIconContainerStyle}>
              <div style={confirmIconCircleStyle}>
                <Check size={32} color="#4F46E5" strokeWidth={3} />
              </div>
            </div>

            <h3 style={confirmTitleStyle}>Confirm Leave Request</h3>
            <p style={confirmDescriptionStyle}>
              Please review your leave details before submitting
            </p>

            <div style={confirmDetailsStyle}>
              <div style={confirmDetailRowStyle}>
                <span style={confirmLabelStyle}>From:</span>
                <span style={confirmValueStyle}>
                  {formatDate(formData.start_date)}
                </span>
              </div>
              <div style={confirmDetailRowStyle}>
                <span style={confirmLabelStyle}>To:</span>
                <span style={confirmValueStyle}>
                  {formatDate(formData.end_date)}
                </span>
              </div>
              <div style={confirmDetailRowStyle}>
                <span style={confirmLabelStyle}>Duration:</span>
                <span style={confirmValueStyle}>
                  {calculateDays()} day{calculateDays() > 1 ? "s" : ""}
                </span>
              </div>
              {formData.reason && (
                <div style={confirmDetailRowStyle}>
                  <span style={confirmLabelStyle}>Reason:</span>
                  <span style={confirmValueStyle}>{formData.reason}</span>
                </div>
              )}
            </div>

            <div style={confirmButtonContainerStyle}>
              <button
                type="button"
                onClick={handleCancelConfirmation}
                disabled={isPending}
                style={confirmCancelButtonStyle}
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isPending}
                style={confirmSubmitButtonStyle}
              >
                {isPending ? (
                  <>
                    <div style={spinnerStyle}></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(4px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  animation: "fadeIn 0.2s ease-out",
};

const modalStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "540px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  animation: "slideUp 0.3s ease-out",
  maxHeight: "90vh",
  overflow: "auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "24px 24px 16px 24px",
  borderBottom: "1px solid #E5E7EB",
};

const headerTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const titleStyle = {
  margin: 0,
  fontSize: "20px",
  fontWeight: "600",
  color: "#111827",
};

const closeButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6B7280",
  transition: "all 0.2s",
};

const formStyle = {
  padding: "24px",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginBottom: "16px",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
};

const requiredStyle = {
  color: "#EF4444",
};

const inputStyle = {
  padding: "10px 14px",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#111827",
  transition: "all 0.2s",
  outline: "none",
  fontFamily: "inherit",
};

const textareaStyle = {
  padding: "10px 14px",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#111827",
  transition: "all 0.2s",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
};

const durationInfoStyle = {
  marginBottom: "16px",
};

const durationBadgeStyle = {
  display: "inline-flex",
  padding: "6px 12px",
  backgroundColor: "#EEF2FF",
  borderRadius: "6px",
  border: "1px solid #C7D2FE",
};

const durationTextStyle = {
  fontSize: "13px",
  fontWeight: "500",
  color: "#4F46E5",
};

const errorStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 16px",
  backgroundColor: "#FEF2F2",
  border: "1px solid #FEE2E2",
  borderRadius: "8px",
  color: "#DC2626",
  fontSize: "14px",
  marginBottom: "16px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "24px",
};

const cancelButtonStyle = {
  padding: "10px 20px",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  transition: "all 0.2s",
};

const submitButtonStyle = {
  padding: "10px 24px",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#ffffff",
  backgroundColor: "#4F46E5",
  cursor: "pointer",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const spinnerStyle = {
  width: "16px",
  height: "16px",
  border: "2px solid #ffffff",
  borderTopColor: "transparent",
  borderRadius: "50%",
  animation: "spin 0.6s linear infinite",
};

// Confirmation Modal Styles
const confirmOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(4px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1001,
  animation: "fadeIn 0.2s ease-out",
};

const confirmModalStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "480px",
  padding: "32px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  animation: "slideUp 0.3s ease-out",
};

const confirmIconContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const confirmIconCircleStyle = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  backgroundColor: "#EEF2FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const confirmTitleStyle = {
  margin: "0 0 8px 0",
  fontSize: "20px",
  fontWeight: "600",
  color: "#111827",
  textAlign: "center",
};

const confirmDescriptionStyle = {
  margin: "0 0 24px 0",
  fontSize: "14px",
  color: "#6B7280",
  textAlign: "center",
};

const confirmDetailsStyle = {
  backgroundColor: "#F9FAFB",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "24px",
};

const confirmDetailRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "10px 0",
  borderBottom: "1px solid #E5E7EB",
};

const confirmLabelStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#6B7280",
};

const confirmValueStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#111827",
  textAlign: "right",
  maxWidth: "60%",
};

const confirmButtonContainerStyle = {
  display: "flex",
  gap: "12px",
};

const confirmCancelButtonStyle = {
  flex: 1,
  padding: "12px 20px",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  transition: "all 0.2s",
};

const confirmSubmitButtonStyle = {
  flex: 1,
  padding: "12px 24px",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#ffffff",
  backgroundColor: "#4F46E5",
  cursor: "pointer",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

// Add these keyframe animations to your global CSS or styled-components
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  input[type="date"]:focus,
  textarea:focus {
    border-color: #4F46E5 !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
  }

  button:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  button:active:not(:disabled) {
    transform: translateY(0);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);