import { useState, useCallback } from "react"
import { User, Phone, Calendar, UserCheck, ChevronRight } from "lucide-react"
import ClientInput from "../inputs/ClientInput"
import ClientSelect from "../common/ClientSelect"
import ClientLayout from "../layout/ClientOnboardingPofileLayout"
import { Gender } from "@/utils/choices"
import * as Yup from "yup"
import { fullNameRule, phoneRule, genderRule } from "@/validators/common.schema"

// ─── Local DOB rule (overrides the shared dobRule with full validation) ────────
const dobRule = Yup.string()
  .required("Date of birth is required")
  .test("valid-date", "Please enter a valid date", (value) => {
    if (!value) return false
    const date = new Date(value)
    return !isNaN(date.getTime())
  })
  .test("not-future", "Date of birth cannot be in the future", (value) => {
    if (!value) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(value) <= today
  })
  .test("min-age", "You must be at least 18 years old", (value) => {
    if (!value) return false
    const today = new Date()
    const dob = new Date(value)
    const age = today.getFullYear() - dob.getFullYear()
    const hasHadBirthdayThisYear =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
    const actualAge = hasHadBirthdayThisYear ? age : age - 1
    return actualAge >= 18
  })
  .test("max-age", "Please enter a valid date of birth", (value) => {
    if (!value) return false
    const today = new Date()
    const dob = new Date(value)
    const age = today.getFullYear() - dob.getFullYear()
    return age <= 120
  })

// ─── Step 1 schema ─────────────────────────────────────────────────────────────
const step1Schema = Yup.object().shape({
  full_name: fullNameRule,
  phone: phoneRule,
  date_of_birth: dobRule,
  gender: genderRule,
})

// ─── Max date helper: today's date as YYYY-MM-DD ───────────────────────────────
const getTodayString = () => new Date().toISOString().split("T")[0]

// ─── Min date helper: 120 years ago ───────────────────────────────────────────
const getMinDateString = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 120)
  return d.toISOString().split("T")[0]
}

// ─── Max date for 18+ rule: today minus 18 years ──────────────────────────────
const getMax18DateString = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  return d.toISOString().split("T")[0]
}

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

  const validateField = useCallback(async (name, value) => {
    try {
      await step1Schema.validateAt(name, { [name]: value })
      setLocalErrors((prev) => ({ ...prev, [name]: "" }))
    } catch (err) {
      setLocalErrors((prev) => ({ ...prev, [name]: err.message }))
    }
  }, [])

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target
      if (!touched[name]) {
        setTouched((prev) => ({ ...prev, [name]: true }))
      }
      // Always validate DOB on blur, even if empty, so "required" shows up
      if (name === "date_of_birth") {
        validateField(name, value)
        return
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
    <ClientLayout currentStep={1} 
        formData={formData}        
        updateFormData={updateFormData} >
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
          // Browser-level guards (UX, not a security substitute for Yup)
          min={getMinDateString()}   // blocks dates > 120 years ago in the picker
          max={getMax18DateString()} // blocks dates within last 18 years in the picker
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