'use client';

const SessionTypeStep = ({ onSubmit, isLoading }) => {
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Session Type</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          disabled={isLoading}
          onClick={() => onSubmit({ session_type: "morning" })}
          className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            isLoading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg hover:from-purple-600 hover:to-purple-700"
          }`}
        >
          <span className="text-lg">🌅</span>
          <p>Morning</p>
        </button>

        <button
          disabled={isLoading}
          onClick={() => onSubmit({ session_type: "evening" })}
          className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            isLoading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg hover:from-purple-600 hover:to-purple-700"
          }`}
        >
          <span className="text-lg">🌆</span>
          <p>Evening</p>
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default SessionTypeStep;
