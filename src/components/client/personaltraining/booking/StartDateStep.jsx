import { useState } from "react";

const StartDateStep = ({ onSubmit, isLoading }) => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ start_date: startDate });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Select Start Date
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            When would you like to start?
          </label>

          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg"
          }`}
        >
          {isLoading ? "Saving..." : "Continue"}
        </button>
      </form>

      {isLoading && (
        <div className="mt-6 flex justify-center">
          <div className="w-6 h-6 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default StartDateStep;