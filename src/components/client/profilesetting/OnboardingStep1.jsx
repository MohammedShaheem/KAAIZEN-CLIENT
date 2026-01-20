import { useState, useCallback } from "react"
import { User, Phone, Calendar, UserCheck, ChevronRight } from "lucide-react"
import ClientInput from "../inputs/ClientInput"
import ClientSelect from "../common/ClientSelect"
import ClientLayout from "../layout/ClientOnboardingPofileLayout"
import { Gender } from "@/utils/choices"
import * as Yup from "yup"
import { fullNameRule, phoneRule, dobRule, genderRule } from "@/validators/common.schema"

const step1Schema = Yup.object().shape({
  full_name: fullNameRule,
  phone: phoneRule,
  date_of_birth: dobRule,
  gender: genderRule,
})

export default function OnboardingStep1({ formData, errors, updateFormData, onSubmit }) {
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
        await step1Schema.validateAt(name, { [name]: value })
        setLocalErrors((prev) => ({ ...prev, [name]: "" }))
      } catch (err) {
        setLocalErrors((prev) => ({ ...prev, [name]: err.message }))
      }
    },
    [step1Schema],
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
      full_name: formData.full_name,
      phone: formData.phone,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
    }

    setTouched({
      full_name: true,
      phone: true,
      date_of_birth: true,
      gender: true,
    })

    try {
      await step1Schema.validate(stepData, { abortEarly: false })
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
    <ClientLayout currentStep={1}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ClientInput
          icon={User}
          label="Full Name"
          name="full_name"
          value={formData.full_name || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.full_name || localErrors.full_name}
          placeholder="Enter your full name"
        />
        <ClientInput
          icon={Phone}
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone || localErrors.phone}
          placeholder="Enter your phone number"
        />
        <ClientInput
          icon={Calendar}
          label="Date of Birth"
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.date_of_birth || localErrors.date_of_birth}
          max={new Date().toISOString().split("T")[0]}
        />
        <ClientSelect
          icon={UserCheck}
          label="Gender"
          name="gender"
          options={Gender}
          value={formData.gender || ""}
          onChange={handleSelectChange}
          error={errors.gender || localErrors.gender}
        />
        <div className="pt-6 flex justify-end">
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
