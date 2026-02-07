'use client';

const SlotSelectionStep = ({ slots = [], onSubmit, isLoading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Time Slot</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slots.length === 0 ? (
          <p className="text-center text-gray-500 py-8 col-span-full">No available slots</p>
        ) : (
          slots.map((slot, i) => (
            <button
              key={i}
              disabled={isLoading}
              onClick={() => onSubmit(slot)}
              className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                isLoading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 text-gray-900 hover:border-purple-500 hover:shadow-md hover:bg-purple-50"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-purple-600 font-semibold">⏰</span>
                <span className="text-lg">{slot.start_time}</span>
                <span className="text-xs text-gray-500">to {slot.end_time}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {isLoading && (
        <div className="mt-6 flex justify-center">
          <div className="w-6 h-6 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default SlotSelectionStep;
