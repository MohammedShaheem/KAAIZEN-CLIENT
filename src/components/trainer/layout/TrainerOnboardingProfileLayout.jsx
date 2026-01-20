import { ArrowRight } from "lucide-react";

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Skills" },
];

export default function TrainerOnboardingProfileLayout({ currentStep, children }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold mb-2">
          SET UP YOUR <span className="text-teal-600">TRAINER PROFILE</span>
        </h1>
        <p className="text-gray-600 mb-8">
          Help clients know more about your experience and skills.
        </p>

        {children}

        <div className="flex justify-center gap-2 mt-8">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all ${
                s.id === currentStep
                  ? "w-8 bg-teal-600"
                  : s.id < currentStep
                  ? "w-3 bg-teal-600"
                  : "w-3 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
