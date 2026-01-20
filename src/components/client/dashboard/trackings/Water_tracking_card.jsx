"use client"

import { useState } from "react"
import { Droplet, Plus, Minus, ThumbsUp } from "lucide-react"
import "../../../../assets/css/client_css/water_tracking_card.css"

/**
 * WaterTrackingCard - Interactive water intake tracking with animated glass
 * Features: Realistic water flowing animation, +/- buttons, and success popup when full
 */
const WaterTrackingCard = ({ data = {} }) => {
  const waterGoal = data.water?.goal || 8
  const [waterIntake, setWaterIntake] = useState(data.water?.current || 0)
  const [showSuccess, setShowSuccess] = useState(false)
  const description = data.water?.description || `Goal: ${waterGoal} glasses`

  const [justFilled, setJustFilled] = useState(false)

  const fillPercentage = Math.min((waterIntake / waterGoal) * 100, 100)

  const handleIncrement = () => {
    const newIntake = Math.min(waterIntake + 1, waterGoal)
    setWaterIntake(newIntake)

    // Trigger success popup only when reaching goal for the first time
    if (newIntake === waterGoal && waterIntake < waterGoal) {
      setShowSuccess(true)
      setJustFilled(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
  }

  const handleDecrement = () => {
    setWaterIntake(Math.max(waterIntake - 1, 0))
    setJustFilled(false)
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white shadow-lg overflow-hidden relative">
      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-6 -mb-6"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full min-h-96 gap-4">
        {/* Header */}
        <div className="flex items-center gap-2 w-full">
          <Droplet className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Water Intake</h3>
        </div>

        {/* Glass animation container */}
        <div className="flex items-center justify-center relative">
          <div className="water-glass-container">
            {/* Glass */}
            <svg className="water-glass" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
              {/* Glass outline */}
              <path
                d="M 20 10 L 25 110 Q 25 115 30 115 L 50 115 Q 55 115 55 110 L 60 10 Z"
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Water fill with animation */}
              <defs>
                <clipPath id="glassFill">
                  <path d="M 20 10 L 25 110 Q 25 115 30 115 L 50 115 Q 55 115 55 110 L 60 10 Z" />
                </clipPath>
              </defs>

              <g clipPath="url(#glassFill)">
                {/* Water fill rectangle */}
                <rect
                  x="20"
                  y={115 - fillPercentage}
                  width="40"
                  height={fillPercentage}
                  fill="url(#waterGradient)"
                  className={justFilled ? "water-fill water-fill-full" : "water-fill"}
                />

                <path
                  d={`M 20 ${115 - fillPercentage} Q 30 ${115 - fillPercentage - 2} 40 ${115 - fillPercentage} T 60 ${115 - fillPercentage}`}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1"
                  className="water-wave"
                />

                {/* Water gradient definition */}
                <defs>
                  <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(147, 197, 253, 0.7)" />
                    <stop offset="50%" stopColor="rgba(96, 165, 250, 0.8)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0.9)" />
                  </linearGradient>
                </defs>

                {fillPercentage > 10 && (
                  <>
                    <circle
                      cx="30"
                      cy={115 - fillPercentage * 0.8}
                      r="2"
                      fill="white"
                      opacity="0.4"
                      className="water-bubble bubble-1"
                    />
                    <circle
                      cx="45"
                      cy={115 - fillPercentage * 0.6}
                      r="1.5"
                      fill="white"
                      opacity="0.3"
                      className="water-bubble bubble-2"
                    />
                    <circle
                      cx="35"
                      cy={115 - fillPercentage * 0.7}
                      r="1"
                      fill="white"
                      opacity="0.25"
                      className="water-bubble bubble-3"
                    />
                  </>
                )}
              </g>
            </svg>
          </div>

          {showSuccess && (
            <div className="absolute success-popup">
              <ThumbsUp className="w-12 h-12 text-yellow-300" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Stats section */}
        <div className="w-full text-center">
          <p className="text-sm opacity-90 mb-2">{description}</p>
          {/* <p className="text-2xl font-bold mb-4">
            {waterIntake} / {waterGoal} glasses
          </p> */}

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleDecrement}
              disabled={waterIntake === 0}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-all duration-200"
              aria-label="Decrease water intake"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="text-sm font-medium px-4 py-2 bg-white/10 rounded-full">{waterIntake} intake</div>

            <button
              onClick={handleIncrement}
              disabled={waterIntake === waterGoal}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-all duration-200"
              aria-label="Increase water intake"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Success message */}
          {fillPercentage === 100 && (
            <p className="text-sm font-semibold mt-3 animate-pulse">🎉 Goal Achieved! Great job!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WaterTrackingCard
