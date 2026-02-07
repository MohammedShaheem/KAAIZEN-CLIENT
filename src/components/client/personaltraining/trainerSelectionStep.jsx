'use client';

const TrainerSelectionStep = ({ trainers = [], onSubmit, isLoading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Trainer</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
      </div>

      <div className="space-y-3">
        {trainers.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No trainers available</p>
        ) : (
          trainers.map((trainer) => (
            <button
              key={trainer.id}
              disabled={isLoading}
              onClick={() => onSubmit({ trainer_id: trainer.id })}
              className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 text-left flex items-center gap-3 ${
                isLoading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-white to-purple-50 border-2 border-purple-200 text-gray-900 hover:border-purple-500 hover:shadow-md hover:bg-purple-50"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {trainer.full_name.charAt(0)}
              </div>
              <span>{trainer.full_name}</span>
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

export default TrainerSelectionStep;
