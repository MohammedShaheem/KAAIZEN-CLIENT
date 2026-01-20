import { useState, useCallback } from "react"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import ClientSelect from "../common/ClientSelect"
import ClientLayout from "../layout/ClientOnboardingPofileLayout"
import { GoalSpeed } from "@/utils/choices"
import * as Yup from "yup"
import { goalSpeedRule } from "@/validators/common.schema"

const step3Schema = Yup.object().shape({
  goal_speed: goalSpeedRule,
})

export default function OnboardingStep3({ formData, errors, updateFormData, onSubmit, onBack }) {
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
        await step3Schema.validateAt(name, { [name]: value })
        setLocalErrors((prev) => ({ ...prev, [name]: "" }))
      } catch (err) {
        setLocalErrors((prev) => ({ ...prev, [name]: err.message }))
      }
    },
    [step3Schema],
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
    const stepData = { goal_speed: formData.goal_speed }

    setTouched({
      goal_speed: true,
    })

    try {
      await step3Schema.validate(stepData, { abortEarly: false })
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
    <ClientLayout currentStep={3}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <p className="text-gray-600">How fast do you want to reach your goal?</p>
        </div>
        <ClientSelect
          icon={Clock}
          label="Goal Pace"
          name="goal_speed"
          options={GoalSpeed}
          value={formData.goal_speed || ""}
          onChange={handleSelectChange}
          error={errors.goal_speed || localErrors.goal_speed}
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
