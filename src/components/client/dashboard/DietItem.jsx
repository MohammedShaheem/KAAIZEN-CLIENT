const DietItem = ({ image, title, time, carbs, protein, fat }) => {
  return (
    <div className="flex gap-4 items-start mb-6">
      <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
        {image ? (
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 mb-2">{time}</p>
        <div className="flex gap-4 text-xs">
          <span className="text-gray-600">• {carbs} carbs</span>
          <span className="text-gray-600">• {protein} protein</span>
          <span className="text-gray-600">• {fat} Fat</span>
        </div>
        <div className="flex gap-1 mt-2">
          <div className="flex-1 h-1 bg-purple-500 rounded"></div>
          <div className="flex-1 h-1 bg-orange-500 rounded"></div>
          <div className="flex-1 h-1 bg-pink-500 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default DietItem
