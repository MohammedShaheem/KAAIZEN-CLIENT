'use client'

import { useEffect, useState, useRef } from "react"
import { useClientProfile, useUpdateClientProfile } from "@/hooks/client/profile/useClientProfile"
import ClientLayout from "@/components/client/layout/ClientLayout"

// ── Enum options (value = backend key, label = display text) ──────────────────
const OPTIONS = {
  gender: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "na", label: "Prefer not to say" },
  ],
  fitness_goal: [
    { value: "weight_loss", label: "Weight Loss" },
    { value: "muscle_gain", label: "Muscle Gain" },
    { value: "maintenance", label: "Maintenance" },
    { value: "flexibility", label: "Flexibility" },
    { value: "endurance", label: "Endurance" },
  ],
  workout_experience: [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ],
  preferred_workout_type: [
    { value: "strength_training", label: "Strength Training" },
    { value: "cardio", label: "Cardio" },
    { value: "yoga", label: "Yoga" },
    { value: "hiit", label: "HIIT" },
    { value: "crossfit", label: "Crossfit" },
    { value: "mixed", label: "Mixed" },
  ],
  goal_speed: [
    { value: "slow", label: "Slow" },
    { value: "moderate", label: "Moderate" },
    { value: "steady", label: "Steady" },
    { value: "fast", label: "Fast" },
  ],
  diet_preference: [
    { value: "veg", label: "Vegetarian" },
    { value: "non_veg", label: "Non-Vegetarian" },
  ],
  daily_activity_level: [
    { value: "sedentary", label: "Sedentary" },
    { value: "light", label: "Light Active" },
    { value: "moderate", label: "Moderately Active" },
    { value: "very_active", label: "Very Active" },
  ],
}

const EMPTY_FORM = {
  full_name: "",
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
  target_daily_calories: "",
  water_goal_ml: "",
}

// ── Reusable field components ─────────────────────────────────────────────────
const fieldCls =
  "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-shadow"

const Field = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={fieldCls}
    />
  </div>
)

const SelectField = ({ label, name, options, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
    <select name={name} value={value} onChange={onChange} className={fieldCls}>
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
)

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
    <span className="text-xl">{icon}</span>
    <h2 className="text-base font-bold text-slate-800">{title}</h2>
  </div>
)

// ── Main page ─────────────────────────────────────────────────────────────────
const ClientProfilePage = () => {
  const { data, isLoading, isError, error } = useClientProfile()
  const updateMutation = useUpdateClientProfile()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(null)

  // Populate form when data arrives
  useEffect(() => {
    if (!data) return
    setFormData({
      full_name: data.full_name || "",
      date_of_birth: data.date_of_birth || "",
      gender: data.gender || "",
      height_cm: data.height_cm || "",
      weight_kg: data.weight_kg || "",
      fitness_goal: data.fitness_goal || "",
      workout_experience: data.workout_experience || "",
      preferred_workout_type: data.preferred_workout_type || "",
      goal_speed: data.goal_speed || "",
      diet_preference: data.diet_preference || "",
      daily_activity_level: data.daily_activity_level || "",
      target_daily_calories: data.target_daily_calories || "",
      water_goal_ml: data.water_goal_ml || "",
    })
    if (data.profile_photo) setProfileImagePreview(data.profile_photo)
  }, [data])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setProfileImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setProfileImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setProfileImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = new FormData()
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v))
    if (profileImage) payload.append("profile_photo", profileImage)
    updateMutation.mutate(payload)
  }

  // ── Shared props helper so field components stay DRY ──
  const fp = (name) => ({ name, value: formData[name], onChange: handleChange })

  // ── Loading / error states ────────────────────────────────────────────────
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Loading profile…</p>
      </div>
    )

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error?.message}</p>
      </div>
    )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ClientLayout>
      <div className="min-h-screen bg-slate-50">

        {/* ── Header ── */}
        <div className="bg-white border-b border-slate-200 px-6 py-5">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">Keep your details up to date</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

          {/* ── Avatar card ── */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-6">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center">
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 truncate">{formData.full_name || "Your Name"}</p>
              <p className="text-sm text-slate-500 capitalize">
                {OPTIONS.fitness_goal.find(o => o.value === formData.fitness_goal)?.label || "Fitness enthusiast"}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  {profileImagePreview ? "Change" : "Upload"} Photo
                </button>
                {profileImagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg hover:border-red-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Personal */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <SectionTitle icon="👤" title="Personal Information" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Full Name" placeholder="Jane Doe" {...fp("full_name")} />
                <Field label="Date of Birth" type="date" {...fp("date_of_birth")} />
                <SelectField label="Gender" options={OPTIONS.gender} {...fp("gender")} />
              </div>
            </div>

            {/* Physical */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <SectionTitle icon="📏" title="Physical Metrics" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Height (cm)" type="number" placeholder="170" {...fp("height_cm")} />
                <Field label="Weight (kg)" type="number" placeholder="70" {...fp("weight_kg")} />
              </div>
            </div>

            {/* Fitness */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <SectionTitle icon="💪" title="Fitness Goals" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Fitness Goal" options={OPTIONS.fitness_goal} {...fp("fitness_goal")} />
                <SelectField label="Workout Experience" options={OPTIONS.workout_experience} {...fp("workout_experience")} />
                <SelectField label="Preferred Workout Type" options={OPTIONS.preferred_workout_type} {...fp("preferred_workout_type")} />
                <SelectField label="Goal Speed" options={OPTIONS.goal_speed} {...fp("goal_speed")} />
              </div>
            </div>

            {/* Nutrition */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <SectionTitle icon="🥗" title="Nutrition & Lifestyle" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Diet Preference" options={OPTIONS.diet_preference} {...fp("diet_preference")} />
                <SelectField label="Daily Activity Level" options={OPTIONS.daily_activity_level} {...fp("daily_activity_level")} />
                <Field label="Target Daily Calories" type="number" placeholder="2000" {...fp("target_daily_calories")} />
                <Field label="Water Goal (ml)" type="number" placeholder="2500" {...fp("water_goal_ml")} />
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {updateMutation.isPending ? "Saving…" : "Save Changes"}
              </button>

              {updateMutation.isError && (
                <p className="mt-3 text-sm text-red-600 text-center">
                  {updateMutation.error?.message || "Something went wrong."}
                </p>
              )}

              {updateMutation.isSuccess && (
                <p className="mt-3 text-sm text-green-600 text-center font-medium">
                  ✓ Profile updated successfully
                </p>
              )}
            </div>

          </form>
        </div>
      </div>
    </ClientLayout>
  )
}

export default ClientProfilePage