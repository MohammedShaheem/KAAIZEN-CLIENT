import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, DollarSign, ToggleRight, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import ClientInput from "@/components/client/inputs/ClientInput";
import ClientSelect from "@/components/client/common/ClientSelect";
import ClientTextArea from "@/components/client/common/ClientTextArea";

import { useMutation } from "@tanstack/react-query";
import { createPlan } from "@/services/admin/personaltraining/PersonalTraining";

const isActiveOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const AddTrainingPlan = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const initialForm = {
    name: "",
    duration_days: "",
    price: "",
    description: "",
    is_active: "true",
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  // ------------------------------
  // Mutation: Create Plan
  // ------------------------------
  const { mutate, isLoading } = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      // Refresh admin plans list automatically
      queryClient.invalidateQueries({ queryKey: ["adminTrainingPlans"] });

      setSuccess(true);
      setFormData(initialForm);
      setErrors({});
      setApiError(null);

      // Auto-hide success after 3s
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (error) => {
      const resData = error?.response?.data;

      if (resData?.detail) {
        setApiError(resData.detail);
      } else if (resData) {
        setErrors({
          name: resData.name?.[0] || "",
          duration_days: resData.duration_days?.[0] || "",
          price: resData.price?.[0] || "",
          description: resData.description?.[0] || "",
          is_active: resData.is_active?.[0] || "",
        });
      } else {
        setApiError("Failed to create training plan. Please try again.");
      }
    },
  });

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = formData.name.trim();

    if (!trimmedName) newErrors.name = "Plan name is required";

    const dur = parseInt(formData.duration_days, 10);
    if (isNaN(dur) || dur <= 0) {
      newErrors.duration_days = "Duration must be a positive number of days";
    }

    const pr = parseFloat(formData.price);
    if (isNaN(pr) || pr <= 0) {
      newErrors.price = "Price must be greater than zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      duration_days: parseInt(formData.duration_days, 10),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      is_active: formData.is_active === "true",
    };

    mutate(payload);
  };

  const handleClose = () => {
    navigate(".."); // goes back to TrainingPlansList
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg relative">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Training Plan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-1">
        <ClientInput
          icon={FileText}
          label="Plan Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g. Beginner 30 Days"
        />

        <ClientInput
          icon={Calendar}
          label="Duration (Days)"
          type="number"
          name="duration_days"
          value={formData.duration_days}
          onChange={handleChange}
          error={errors.duration_days}
          min="1"
          placeholder="e.g. 30"
        />

        <ClientInput
          icon={DollarSign}
          label="Price (₹)"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          step="0.01"
          min="0.01"
          placeholder="e.g. 999.00"
        />

        <ClientTextArea
          icon={FileText}
          label="Description (Optional)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Describe the plan features, target audience, etc."
          rows={4}
        />

        <ClientSelect
          icon={ToggleRight}
          label="Is Active"
          name="is_active"
          options={isActiveOptions}
          value={formData.is_active}
          onChange={handleChange}
          error={errors.is_active}
        />

        {apiError && (
          <p className="text-red-500 text-sm mb-4">{apiError}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm mb-4">
            Training plan created successfully!
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Plan..." : "Create Training Plan"}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTrainingPlan;
