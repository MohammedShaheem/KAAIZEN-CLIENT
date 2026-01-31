import { Bed, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const SleepTrackingCard = () => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate("/sleep/log")}
      className="bg-gradient-to-br from-indigo-500 to-indigo-700 
                 rounded-lg p-6 text-white shadow-lg 
                 cursor-pointer transition-all duration-200 
                 hover:scale-[1.02] hover:shadow-xl 
                 relative overflow-hidden"
    >
      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-6 -mb-6"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-48 gap-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Bed className="w-7 h-7" />
          <h3 className="text-xl font-semibold">Sleep Tracking</h3>
        </div>

        {/* Icon */}
        <Bed className="w-20 h-20 opacity-80" />

        {/* CTA */}
        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
          <span>Open Sleep Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </div>

        <p className="text-xs opacity-75 text-center">
          Log your sleep, view weekly reports & tips
        </p>
      </div>
    </div>
  )
}

export default SleepTrackingCard
