import { ArrowRight, Upload, User } from "lucide-react"

const STEPS = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Fitness Details" },
  { id: 3, label: "Goal Pace" },
  { id: 4, label: "Lifestyle" },
]

export default function ClientLayout({ currentStep = 1, children }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Column: Form Content */}
        <div className="max-w-md w-full mx-auto lg:mx-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              "TELL US ABOUT <span className="text-purple-600">YOU"</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Help us personalize your experience by filling out your basic details.
            </p>
          </div>

          {/* Form Content */}
          <div className="mb-8">{children}</div>

          {/* Progress Indicators */}
          <div className="flex gap-2 justify-center">
            {STEPS.map((step) => (
              <button
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all ${
                  step.id === currentStep
                    ? "bg-purple-600 w-8"
                    : step.id < currentStep
                      ? "bg-purple-600"
                      : "bg-gray-300"
                }`}
                aria-label={`Step ${step.id}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Image Section with Purple Circle */}
        <div className="hidden lg:flex items-center justify-center relative h-96">
          {/* Large Purple Circle Background */}
          <div className="absolute w-96 h-96 bg-purple-600 rounded-full opacity-20" />

          {/* Profile Photo Upload Placeholder */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative w-80 h-80 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center border-4 border-purple-200 shadow-lg">
              {/* User Icon Placeholder */}
              <div className="text-center">
                <User className="w-32 h-32 text-purple-300 mx-auto mb-4" />
                <p className="text-purple-600 font-semibold text-lg">Upload Photo</p>
                <p className="text-purple-400 text-sm mt-1">JPG, PNG up to 5MB</p>
              </div>

              {/* Upload Indicator Badge */}
              <div className="absolute bottom-6 right-6 bg-purple-600 rounded-full p-3 shadow-lg hover:bg-purple-700 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skip Button */}
      {/* <div className="absolute top-6 right-6">
        <button className="flex items-center gap-2 px-6 py-3 border-2 border-teal-500 text-teal-600 font-semibold rounded-full hover:bg-teal-50 transition-colors">
          SKIP
          <ArrowRight className="w-5 h-5" />
        </button>
      </div> */}
    </div>
  )
}
