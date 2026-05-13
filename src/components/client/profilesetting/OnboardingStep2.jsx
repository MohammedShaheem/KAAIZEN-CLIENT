import { useState, useCallback } from "react"
import { Ruler, Scale, Target, Star, Dumbbell, ChevronLeft, ChevronRight } from "lucide-react"
import ClientInput from "../inputs/ClientInput"
import ClientSelect from "../common/ClientSelect"
import ClientLayout from "../layout/ClientOnboardingPofileLayout"
import { FitnessGoal, WorkoutExperience, PreferredWorkoutType } from "@/utils/choices"
import * as Yup from "yup"
import {
  heightCmRule,
  weightKgRule,
  fitnessGoalRule,
  workoutExperienceRule,
  preferredWorkoutTypeRule,
} from "@/validators/common.schema"

const step2Schema = Yup.object().shape({
  height_cm: heightCmRule,
  weight_kg: weightKgRule,
  fitness_goal: fitnessGoalRule,
  workout_experience: workoutExperienceRule,
  preferred_workout_type: preferredWorkoutTypeRule,
})

export default function OnboardingStep2({ formData, errors, updateFormData, onSubmit, onBack }) {
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
        const validatedValue = name === "height_cm" || name === "weight_kg" ? Number.parseFloat(value) || 0 : value
        await step2Schema.validateAt(name, { [name]: validatedValue })
        setLocalErrors((prev) => ({ ...prev, [name]: "" }))
      } catch (err) {
        setLocalErrors((prev) => ({ ...prev, [name]: err.message }))
      }
    },
    [step2Schema],
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
      height_cm: Number.parseFloat(formData.height_cm) || 0,
      weight_kg: Number.parseFloat(formData.weight_kg) || 0,
      fitness_goal: formData.fitness_goal,
      workout_experience: formData.workout_experience,
      preferred_workout_type: formData.preferred_workout_type,
    }

    setTouched({
      height_cm: true,
      weight_kg: true,
      fitness_goal: true,
      workout_experience: true,
      preferred_workout_type: true,
    })

    try {
      await step2Schema.validate(stepData, { abortEarly: false })
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
    <ClientLayout currentStep={2}
        formData={formData}        
        updateFormData={updateFormData}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ClientInput
          icon={Ruler}
          label="Height (cm)"
          name="height_cm"
          type="number"
          value={formData.height_cm || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.height_cm || localErrors.height_cm}
          placeholder="170"
          min="1"
        />
        <ClientInput
          icon={Scale}
          label="Weight (kg)"
          name="weight_kg"
          type="number"
          value={formData.weight_kg || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.weight_kg || localErrors.weight_kg}
          placeholder="70"
          min="1"
        />
        <ClientSelect
          icon={Target}
          label="Fitness Goal"
          name="fitness_goal"
          options={FitnessGoal}
          value={formData.fitness_goal || ""}
          onChange={handleSelectChange}
          error={errors.fitness_goal || localErrors.fitness_goal}
        />
        <ClientSelect
          icon={Star}
          label="Workout Experience"
          name="workout_experience"
          options={WorkoutExperience}
          value={formData.workout_experience || ""}
          onChange={handleSelectChange}
          error={errors.workout_experience || localErrors.workout_experience}
        />
        <ClientSelect
          icon={Dumbbell}
          label="Preferred Workout Type"
          name="preferred_workout_type"
          options={PreferredWorkoutType}
          value={formData.preferred_workout_type || ""}
          onChange={handleSelectChange}
          error={errors.preferred_workout_type || localErrors.preferred_workout_type}
        />
        <div className="pt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
          >
            <span>Continue</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </form>
    </ClientLayout>
  )
}
