import { useState } from "react";

const StartDateStep = ({ onSubmit, isLoading }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(tomorrowStr);
  const [error, setError] = useState("");

  const validate = (dateStr) => {
    if (!dateStr) return "Please select a date.";

    const selected = new Date(dateStr + "T00:00:00");
    if (selected <= today) return "You cannot select today or a past date.";
    if (selected.getDay() === 0) return "Sundays are not available. Please choose another day.";

    return "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    setError(validate(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate(startDate);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit({ start_date: startDate });
  };

  const isInvalid = !!validate(startDate);

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
            min={tomorrowStr}
            value={startDate}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
              error
                ? "border-red-400 focus:border-red-500"
                : "border-purple-200 focus:border-purple-500"
            }`}
          />

          {error && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <span>⚠</span> {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || isInvalid}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            isLoading || isInvalid
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