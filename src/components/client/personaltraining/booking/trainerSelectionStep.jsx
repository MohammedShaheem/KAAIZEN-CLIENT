const TrainerSelectionStep = ({ trainers = [], onSubmit, isLoading }) => {
  return (
  <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Select Trainer
      </h2>
      <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
    </div>

    <div className="space-y-4">
      {trainers.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No trainers available
        </p>
      ) : (
        trainers.map((trainer) => (
          <button
            key={trainer.id}
            disabled={isLoading}
            onClick={() => onSubmit({ trainer_id: trainer.id })}
            className={`w-full px-6 py-5 rounded-xl font-semibold transition-all duration-300 text-left ${
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-white to-purple-50 border-2 border-purple-200 hover:border-purple-500 hover:shadow-md hover:bg-purple-50"
            }`}
          >
            <div className="flex items-start gap-4">
              
              
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                {trainer.full_name?.charAt(0)}
              </div>

              
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900">
                  {trainer.full_name}
                </p>

                
                <p className="text-sm text-gray-600 mt-1">
                  Experience:{" "}
                  <span className="font-medium text-purple-600">
                    {trainer.experience_years}{" "}
                    {trainer.experience_years === 1 ? "year" : "years"}
                  </span>
                </p>

                
                <div className="flex flex-wrap gap-2 mt-3">
                  {trainer.skills && trainer.skills.length > 0 ? (
                    trainer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full"
                      >
                        {skill.replaceAll("_", " ")}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">
                      No skills listed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))
      )}
    </div>

    {isLoading && (
      <div className="mt-6 flex justify-center">
        <div className="w-6 h-6 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    )}
  </div>
);
}

export default TrainerSelectionStep;
