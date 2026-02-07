'use client'

import { useEffect, useState, useRef } from "react"
import { useClientProfile, useUpdateClientProfile } from "@/hooks/client/profile/useClientProfile"
import ClientLayout from "@/components/client/layout/ClientLayout"

const ClientProfilePage = () => {
  const { data, isLoading, isError, error } = useClientProfile()
  const updateMutation = useUpdateClientProfile()

  const [activeSection, setActiveSection] = useState("personal")
  const [visibleSections, setVisibleSections] = useState({})
  const sectionRefs = useRef({})

  const [formData, setFormData] = useState({
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
  })

  // Load profile data
  useEffect(() => {
    if (data) {
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
    }
  }, [data])

  // Scroll-triggered animations + active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id

          if (entry.isIntersecting) {
            setActiveSection(id)
            setVisibleSections((prev) => ({
              ...prev,
              [id]: true,
            }))
          }
        })
      },
      {
        threshold: 0.4,
        rootMargin: "-80px 0px -80px 0px",
      }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  const scrollToSection = (sectionId) => {
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
    setActiveSection(sectionId)
  }

  // Section animation + highlight class helper
  const getSectionClass = (id) => {
    const isActive = activeSection === id
    const isVisible = visibleSections[id]

    return `
      rounded-xl p-8 border-2
      scroll-mt-32
      transition-all duration-700 ease-out
      transform
      ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}
      ${isActive ? "border-slate-800 bg-slate-50" : "border-slate-300 bg-white"}
    `
  }

  const inputField = ({ label, name, type = "text", placeholder = "" }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
      />
    </div>
  )

  const sections = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "physical", label: "Physical Metrics", icon: "📏" },
    { id: "fitness", label: "Fitness Goals", icon: "💪" },
    { id: "nutrition", label: "Nutrition", icon: "🥗" },
  ]

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    )

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">{error?.message}</p>
      </div>
    )

  return (
    <ClientLayout>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">
            My Fitness Profile
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your personal and fitness information
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="border-2 border-slate-800 rounded-2xl bg-white shadow-xl overflow-hidden">
          {/* Main Content */}
          <div className="p-8 md:p-12">
            {/* Profile Photo */}
            <div className="mb-10 pb-10 border-b-2 border-slate-200">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center shadow-lg border-4 border-slate-800">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-slate-900 font-bold text-2xl">
                    {formData.full_name || "Your Name"}
                  </p>
                  <p className="text-slate-600 text-sm mt-1">
                    {formData.fitness_goal || "Fitness enthusiast"}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* PERSONAL */}
              <div
                id="personal"
                ref={(el) => (sectionRefs.current.personal = el)}
                className={getSectionClass("personal")}
              >
                <div className="mb-6 pb-4 border-b-2 border-slate-300">
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                    <span className="text-3xl">👤</span>
                    Personal Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {inputField({
                    label: "Full Name",
                    name: "full_name",
                    placeholder: "Enter your full name",
                  })}
                  {inputField({
                    label: "Date of Birth",
                    name: "date_of_birth",
                    type: "date",
                  })}
                  {inputField({
                    label: "Gender",
                    name: "gender",
                    placeholder: "e.g., Male, Female, Other",
                  })}
                </div>
              </div>

              {/* PHYSICAL */}
              <div
                id="physical"
                ref={(el) => (sectionRefs.current.physical = el)}
                className={getSectionClass("physical")}
              >
                <div className="mb-6 pb-4 border-b-2 border-slate-300">
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                    <span className="text-3xl">📏</span>
                    Physical Metrics
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {inputField({
                    label: "Height (cm)",
                    name: "height_cm",
                    type: "number",
                    placeholder: "Enter height in cm",
                  })}
                  {inputField({
                    label: "Weight (kg)",
                    name: "weight_kg",
                    type: "number",
                    placeholder: "Enter weight in kg",
                  })}
                </div>
              </div>

              {/* FITNESS */}
              <div
                id="fitness"
                ref={(el) => (sectionRefs.current.fitness = el)}
                className={getSectionClass("fitness")}
              >
                <div className="mb-6 pb-4 border-b-2 border-slate-300">
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                    <span className="text-3xl">💪</span>
                    Fitness Goals
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {inputField({
                    label: "Fitness Goal",
                    name: "fitness_goal",
                    placeholder: "e.g., Weight Loss, Muscle Gain",
                  })}
                  {inputField({
                    label: "Workout Experience",
                    name: "workout_experience",
                    placeholder: "e.g., Beginner, Intermediate",
                  })}
                  {inputField({
                    label: "Preferred Workout Type",
                    name: "preferred_workout_type",
                    placeholder: "e.g., Cardio, Strength",
                  })}
                  {inputField({
                    label: "Goal Speed",
                    name: "goal_speed",
                    placeholder: "Enter goal speed",
                  })}
                </div>
              </div>

              {/* NUTRITION */}
              <div
                id="nutrition"
                ref={(el) => (sectionRefs.current.nutrition = el)}
                className={getSectionClass("nutrition")}
              >
                <div className="mb-6 pb-4 border-b-2 border-slate-300">
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                    <span className="text-3xl">🥗</span>
                    Nutrition & Lifestyle
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {inputField({
                    label: "Diet Preference",
                    name: "diet_preference",
                    placeholder: "e.g., Vegan, Keto",
                  })}
                  {inputField({
                    label: "Daily Activity Level",
                    name: "daily_activity_level",
                    placeholder: "e.g., Sedentary, Moderate",
                  })}
                  {inputField({
                    label: "Target Daily Calories",
                    name: "target_daily_calories",
                    type: "number",
                    placeholder: "Enter calorie target",
                  })}
                  {inputField({
                    label: "Water Goal (ml)",
                    name: "water_goal_ml",
                    type: "number",
                    placeholder: "Enter daily water goal",
                  })}
                </div>
              </div>

              {/* SUBMIT */}
              <div className="rounded-xl p-8 border-2 border-slate-300 bg-white">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {updateMutation.isPending ? "Updating..." : "Update Profile"}
                </button>

                {updateMutation.isError && (
                  <div className="bg-slate-100 border-2 border-slate-400 text-slate-800 px-4 py-3 rounded-lg mt-4">
                    <p className="font-medium">Error updating profile</p>
                    <p className="text-sm mt-1">
                      {updateMutation.error?.message}
                    </p>
                  </div>
                )}

                {updateMutation.isSuccess && (
                  <div className="bg-slate-100 border-2 border-slate-400 text-slate-800 px-4 py-3 rounded-lg mt-4">
                    Profile updated successfully!
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </ClientLayout>
  )
}

export default ClientProfilePage
