import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Spinner } from "@/components/common/Spinner"
import MealSlotCard from "@/components/client/dashboard/MealSlotCard"
import LogMealModal from "@/components/client/dashboard/LogModal"
import ClientLayout from "@/components/client/layout/ClientLayout"

import {
  useMealAllocations,
  useDailySummary,
  useMealEntries,
  useLogMeal,
} from "@/hooks/client/nutrition/useMeals"

import { useClientProfile } from "@/hooks/client/profile/useClientProfile"

const MealLoggingPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState(null)

  const navigate = useNavigate()
  const currentDate = new Date().toISOString().split("T")[0]

  // profile
  const { data: profile } = useClientProfile()

  // meal allocations
  const {
    data: allocations = [],
    isLoading: allocLoading,
    error: allocError,
  } = useMealAllocations()

  console.log("allocations from meal logging page", allocations)

  // daily summary
  const {
    data: dailySummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useDailySummary(currentDate)
  console.log("from meal allocation total calories consumed",dailySummary.summary.total_calories)

  // meal entries
  const {
    data: mealEntries = [],
    isLoading: entriesLoading,
    error: entriesError,
  } = useMealEntries(currentDate)

  const logMeal = useLogMeal(currentDate)

  const openModal = (mealType) => {
    setSelectedMealType(mealType)
    setModalOpen(true)
  }

  const handleLogMeal = (data) => {
    logMeal.mutate(data)
    setModalOpen(false)
  }

  const getMealData = (mealType) => {
    const typeEntries = mealEntries.filter((e) => e.meal_type === mealType)

    const entries = typeEntries.map((e) => e.food_description)

    const currentCal = typeEntries.reduce(
      (sum, e) => sum + (e.total_calories || 0),
      0
    )

    return { entries, currentCal }
  }

  if (allocLoading || summaryLoading || entriesLoading) {
    return <Spinner loading={true} />
  }

  if (allocError || summaryError || entriesError) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-semibold">
            Failed to load meal data. Please try again.
          </p>
        </div>
      </div>
    )
  }

  const userData = {
    name: profile?.full_name || "Client",
  }

  const motivational = {
    breakfast: "All you need is some breakfast ☀️🔍",
    morning_snack: "Get energized by grabbing a morning snack 🥜",
    lunch: "Time for lunch – fuel up! 🍱",
    evening_snack: "Evening recharge time 🧃",
    dinner: "End the day strong with dinner 🌙",
  }

  return (
    <ClientLayout
      theme="orange"
      headerProps={{
        userName: userData?.name || "Client",
        location: "Meal Tracking",
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 pb-12">
        {/* Summary Section */}
        {dailySummary && (
          <div className="px-4 mb-8">
            <div className="bg-white border-2 border-orange-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-5">
                <h2 className="text-white font-bold text-lg">Today's Summary</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 p-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    Total Calories
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {dailySummary?.summary?.total_calories || 0}
                  </p>
                </div>
                <div className="text-center border-l-2 border-r-2 border-orange-100">
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    Target Calories
                  </p>
                  <p className="text-3xl font-bold text-orange-500">
                    {profile.target_daily_calories || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    Remaining
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.max(
                      0,
                      (profile?.target_daily_calories  || 0) -
                        (dailySummary?.summary?.total_calories || 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meal Slots Section */}
        <div className="px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Meal Slots</h2>

          {allocations.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-orange-300 rounded-2xl p-12 text-center">
              <p className="text-gray-500 text-lg">
                No meal allocations yet—create your profile!
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {allocations.map((alloc) => {
                const { entries, currentCal } = getMealData(
                  alloc.meal_type
                )

                return (
                  <div
                    key={alloc.meal_type}
                    className="bg-white border-2 border-orange-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-orange-300"
                  >
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {alloc.meal_type === "breakfast"
                              ? "☀️"
                              : alloc.meal_type === "morning_snack"
                              ? "🥜"
                              : alloc.meal_type === "lunch"
                              ? "🍱"
                              : alloc.meal_type === "evening_snack"
                              ? "🧃"
                              : "🌙"}
                          </span>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 capitalize">
                              {alloc.meal_type.replace("_", " ")}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {motivational[alloc.meal_type]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            Calories
                          </span>
                          <span className="text-sm font-bold text-orange-600">
                            {currentCal} / {alloc.target_calories} kcal
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (currentCal / alloc.target_calories) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Logged Foods */}
                      {entries.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Logged Foods:
                          </h4>
                          <div className="space-y-2">
                            {entries.map((food, idx) => (
                              <div
                                key={idx}
                                className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-sm text-gray-700"
                              >
                                • {food}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add Meal Button */}
                      <button
                        onClick={() => openModal(alloc.meal_type)}
                        className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">+</span>
                        <span>Add Meal</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Modal */}
        <LogMealModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          mealType={selectedMealType}
          onSubmit={handleLogMeal}
        />
      </div>
    </ClientLayout>
  )
}

export default MealLoggingPage
