/**
 * TrackingCard - Generic tracking card component
 * Used for Food, Sleep, Calories and other health metrics
 */
const TrackingCard = ({ icon: Icon, title, description, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-6 ${textColor} shadow-lg overflow-hidden relative`}>
      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-6 -mb-6"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-start justify-between h-full min-h-32">
        {/* Header with icon */}
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-6 h-6" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>

        {/* Description */}
        <p className="text-sm opacity-90 mt-auto">{description}</p>
      </div>
    </div>
  )
}

export default TrackingCard
