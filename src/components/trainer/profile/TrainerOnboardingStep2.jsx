import TrainerOnboardingProfileLayout from "../layout/TrainerOnboardingProfileLayout";
import { Skill } from "@/utils/choices";

export default function TrainerOnboardingStep2({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  isSubmitting,
}) {
  const toggleSkill = (skill) => {
    const skills = formData.skills.includes(skill)
      ? formData.skills.filter((s) => s !== skill)
      : [...formData.skills, skill];

    updateFormData({ skills });
  };

  return (
    <TrainerOnboardingProfileLayout currentStep={2}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Select Your Skills</h2>

        <div className="grid grid-cols-2 gap-3">
          {Skill.map((skill) => (
            <label key={skill.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.skills.includes(skill.value)}
                onChange={() => toggleSkill(skill.value)}
              />
              {skill.label}
            </label>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <button onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button
              disabled={isSubmitting}
              onClick={async () => {
                const success = await onSubmit({ skills: formData.skills });
                if (success) {
                  navigate("/dashboard");
                }
              }}
              className="btn-primary"
            >
              Finish
          </button>

        </div>
      </div>
    </TrainerOnboardingProfileLayout>
  );
}
