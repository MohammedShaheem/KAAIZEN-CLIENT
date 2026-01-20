import { useState } from "react"
import { Bed, Plus, ThumbsUp } from "lucide-react"

const SleepTrackingCard = ({ data = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sleepTime, setSleepTime] = useState("22:00")
  const [wakeTime, setWakeTime] = useState("06:00")
  const [isGoalAchieved, setIsGoalAchieved] = useState(data.sleep?.completed || false)

  // Calculate sleep duration in hours
  const calculateSleepHours = () => {
    const sleep = new Date(`2024-01-01 ${sleepTime}`)
    const wake = new Date(`2024-01-02 ${wakeTime}`)
    const diff = (wake - sleep) / (1000 * 60 * 60)
    return Math.round(diff * 10) / 10 // Round to 1 decimal place
  }

  const sleepHours = calculateSleepHours()

  const handleTrackClick = () => {
    setIsModalOpen(true)
  }

  const handleCompleteSchedule = () => {
    setIsGoalAchieved(true)
    setIsModalOpen(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg p-6 text-white shadow-lg overflow-hidden relative">
      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-6 -mb-6"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full min-h-96 gap-4">
        {/* Header */}
        <div className="flex items-center gap-2 w-full">
          <Bed className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Sleep Tracking</h3>
        </div>

        {/* Bed Icon */}
        <div className="flex items-center justify-center">
          <Bed className="w-20 h-20 opacity-80" />
        </div>

        {/* Track Button */}
        <button
          onClick={handleTrackClick}
          className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 flex items-center gap-2"
          aria-label="Track sleep"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Track Sleep</span>
        </button>

        {/* Goal Achievement Status */}
        {isGoalAchieved && (
          <div className="flex items-center gap-2 mt-2">
            <ThumbsUp className="w-5 h-5 text-yellow-300" fill="currentColor" />
            <p className="text-sm font-semibold">Goal Achieved!</p>
          </div>
        )}

        {!isGoalAchieved && <p className="text-xs opacity-75 text-center">Set your sleep schedule to track</p>}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal Container */}
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4">
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Track Your Sleep</h2>

            {/* Health Recommendation */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <p className="text-sm text-blue-900 font-medium">💡 Aim to sleep for 7 to 8 hours for good health</p>
            </div>

            {/* Sleep Time Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sleep Time</label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              />
            </div>

            {/* Wake Time Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Wake Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              />
            </div>

            {/* Sleep Duration Display */}
            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Estimated Sleep Duration</p>
              <p className="text-3xl font-bold text-indigo-600">{sleepHours} hours</p>
            </div>

            {/* Complete Button */}
            <button
              onClick={handleCompleteSchedule}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold py-3 rounded-lg hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200 mb-3"
            >
              ✓ Did you complete this sleep schedule today?
            </button>

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SleepTrackingCard
