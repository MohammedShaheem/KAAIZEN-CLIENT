import { useState, useCallback } from "react"
import { Utensils, Activity, Stethoscope, ChevronLeft, Check } from "lucide-react"
import ClientSelect from "../common/ClientSelect"
import ClientTextArea from "../common/ClientTextArea"
import ClientLayout from "../layout/ClientOnboardingPofileLayout"
import { DietPreference, DailyActivityLevel } from "@/utils/choices"
import * as Yup from "yup"
import { dietPreferenceRule, dailyActivityLevelRule, medicalConditionsRule } from "@/validators/common.schema"

const step4Schema = Yup.object().shape({
  diet_preference: dietPreferenceRule,
  daily_activity_level: dailyActivityLevelRule,
  medical_conditions: medicalConditionsRule,
})

export default function OnboardingStep4({ formData, errors, updateFormData, onSubmit, onBack, isSubmitting }) {
  const [localErrors, setLocalErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target
      updateFormData({ [name]: value })
      if (localErrors[name]) {
        setLocalErrors((prev) => ({ ...prev, [name]: "" }))
      }
    },
    [updateFormData, localErrors],
  )

  const validateField = useCallback(
    async (name, value) => {
      try {
        await step4Schema.validateAt(name, { [name]: value })
        setLocalErrors((prev) => ({ ...prev, [name]: "" }))
      } catch (err) {
        setLocalErrors((prev) => ({ ...prev, [name]: err.message }))
      }
    },
    [step4Schema],
  )

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target
      if (!touched[name]) {
        setTouched((prev) => ({ ...prev, [name]: true }))
      }
      if (value !== undefined && value !== null && value !== "") {
        validateField(name, value)
      }
    },
    [validateField, touched],
  )

  const handleSelectChange = useCallback(
    (e) => {
      const { name, value } = e.target
      handleChange(e)
      setTouched((prev) => ({ ...prev, [name]: true }))
      if (value) {
        validateField(name, value)
      }
    },
    [handleChange, validateField],
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    const stepData = {
      diet_preference: formData.diet_preference,
      daily_activity_level: formData.daily_activity_level,
      medical_conditions: formData.medical_conditions,
    }

    setTouched({
      diet_preference: true,
      daily_activity_level: true,
      medical_conditions: true,
    })

    try {
      await step4Schema.validate(stepData, { abortEarly: false })
      setLocalErrors({})
      onSubmit(stepData)
    } catch (err) {
      const stepErrors = {}
      err.inner.forEach((error) => {
        stepErrors[error.path] = error.message
      })
      setLocalErrors(stepErrors)
    }
  }

  return (
    <ClientLayout currentStep={4}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ClientSelect
          icon={Utensils}
          label="Diet Preference"
          name="diet_preference"
          options={DietPreference}
          value={formData.diet_preference || ""}
          onChange={handleSelectChange}
          error={errors.diet_preference || localErrors.diet_preference}
        />
        <ClientSelect
          icon={Activity}
          label="Daily Activity Level"
          name="daily_activity_level"
          options={DailyActivityLevel}
          value={formData.daily_activity_level || ""}
          onChange={handleSelectChange}
          error={errors.daily_activity_level || localErrors.daily_activity_level}
        />
        <ClientTextArea
          icon={Stethoscope}
          label="Medical Conditions (optional)"
          name="medical_conditions"
          value={formData.medical_conditions || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.medical_conditions || localErrors.medical_conditions}
          placeholder="List any relevant medical conditions..."
        />
        <div className="pt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="group flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span>{isSubmitting ? "Creating Profile..." : "Complete Profile"}</span>
            <Check className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </form>
    </ClientLayout>
  )
}
