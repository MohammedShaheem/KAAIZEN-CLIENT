"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainerOnboardingStep1 from "@/components/trainer/profile/TrainerOnboardingStep1";
import TrainerOnboardingStep2 from "@/components/trainer/profile/TrainerOnboardingStep2";
import { createTrainerProfile } from "@/services/trainer/trainers";

export default function TrainerOnboardingMain() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    bio: "",
    experience_certificate: "",
    skills: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(updates).forEach((k) => delete next[k]);
      return next;
    });
  };

  const handleNext = (stepData) => {
    updateFormData(stepData);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async (stepData) => {
    const payload = { ...formData, ...stepData };
    setIsSubmitting(true);
    try {
      await createTrainerProfile(payload);
      navigate("/trainer/trainer_dashboard", { replace: true });
    } catch (err) {
      setErrors({ general: "Failed to create trainer profile." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 1) {
    return (
      <TrainerOnboardingStep1
        formData={formData}
        errors={errors}
        updateFormData={updateFormData}
        onSubmit={handleNext}
      />
    );
  }

  return (
    <TrainerOnboardingStep2
      formData={formData}
      errors={errors}
      updateFormData={updateFormData}
      onSubmit={handleComplete}
      onBack={handleBack}
      isSubmitting={isSubmitting}
    />
  );
}
