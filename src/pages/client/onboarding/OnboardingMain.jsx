import { useState } from "react"
import { useSelector } from "react-redux"
import OnboardingStep1 from "@/components/client/profilesetting/OnboardingStep1"
import OnboardingStep2 from "@/components/client/profilesetting/OnboardingStep2"
import OnboardingStep3 from "@/components/client/profilesetting/OnboardingStep3"
import OnboardingStep4 from "@/components/client/profilesetting/OnboardingStep4"
import { createClientProfile } from "@/services/client/clients"
import { useNavigate } from "react-router-dom"

export default function OnboardingMain() {
  const { user } = useSelector((state) => state.auth)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "", 
    phone: "",
    date_of_birth: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    fitness_goal: "",
    workout_experience: "",
    preferred_workout_type: "",
    goal_speed: "",
    diet_preference: "",
    daily_activity_level: "",
    medical_conditions: "",
    profile_picture: user?.profile_picture || "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    setErrors((prev) => {
      const newErrors = { ...prev }
      Object.keys(updates).forEach((key) => delete newErrors[key])
      return newErrors
    })
  }

  const handleStepSubmit = (stepData) => {
    updateFormData(stepData)
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = async (stepData) => {
    const fullData = {
      ...formData,
      ...stepData,
    }
    setIsSubmitting(true)
    console.log("data before profile creation",fullData);
    
    try {
      await createClientProfile(fullData)
      console.log("Profile created:", fullData)

      navigate("/dashboard", { replace: true })
    } catch (err) {
      console.error("Full API Error:", err.response?.data || err.message)
      setErrors({ general: "Failed to create profile. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            onSubmit={handleStepSubmit}
          />
        )
      case 2:
        return (
          <OnboardingStep2
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            onSubmit={handleStepSubmit}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <OnboardingStep3
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            onSubmit={handleStepSubmit}
            onBack={handleBack}
          />
        )
      case 4:
        return (
          <OnboardingStep4
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            onSubmit={handleComplete}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <div>
      {renderStep()}
      {errors.general && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg">{errors.general}</div>
      )}
    </div>
  )
}
