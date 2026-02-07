import React, { useEffect, useState } from "react";
import {
  useTrainerProfile,
  useCreateTrainerProfile,
  useUpdateTrainerProfile,
} from "@/hooks/trainer/useTrainerProfile";
import Sidebar from "@/components/trainer/ui/sidebar";

const SKILLS = [
  "strength_training",
  "yoga",
  "cardio",
  "crossfit",
  "weight_loss",
];

const SHIFT_TYPES = [
  { label: "Morning", value: "morning" },
  { label: "Evening", value: "evening" },
  { label: "Both", value: "both" },
];

export default function TrainerProfilePage() {
  const { data: profile, isLoading } = useTrainerProfile();
  const createMutation = useCreateTrainerProfile();
  const updateMutation = useUpdateTrainerProfile();

  const isEditMode = Boolean(profile);

  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    experience_years: "",
    bio: "",
    skills: [],
    shift_type: "both",
    max_sessions_per_day: 5,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        date_of_birth: profile.date_of_birth || "",
        gender: profile.gender || "",
        experience_years: profile.experience_years ?? "",
        bio: profile.bio || "",
        skills: profile.skills || [],
        shift_type: profile.shift_type || "both",
        max_sessions_per_day: profile.max_sessions_per_day ?? 5,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleSkill = (skill) => {
    setForm((p) => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter((s) => s !== skill)
        : [...p.skills, skill],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      experience_years:
        form.experience_years === "" ? null : Number(form.experience_years),
    };

    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading profile…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ✅ Sidebar fixed on the left */}
      <Sidebar />

      {/* ✅ Main content area */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">
            {isEditMode ? "Edit Trainer Profile" : "Create Trainer Profile"}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border p-6 space-y-6"
          >
            {/* Basic Info */}
            <Section title="Basic Information">
              <Input
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
              />

              <Input
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={handleChange}
              />

              <Select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
              />
            </Section>

            {/* Professional */}
            <Section title="Professional Details">
              <Input
                label="Experience (Years)"
                name="experience_years"
                type="number"
                min={0}
                value={form.experience_years}
                onChange={handleChange}
              />

              <Textarea
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        form.skills.includes(skill)
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100"
                      }`}
                    >
                      {skill.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <Select
                label="Shift Type"
                name="shift_type"
                value={form.shift_type}
                onChange={handleChange}
                options={SHIFT_TYPES}
              />

              <Input
                label="Max Sessions Per Day"
                name="max_sessions_per_day"
                type="number"
                min={1}
                value={form.max_sessions_per_day}
                onChange={handleChange}
              />
            </Section>

            {/* Verification */}
            {isEditMode && (
              <Section title="Verification">
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={
                      profile.is_verified
                        ? "text-green-600 font-semibold"
                        : "text-yellow-600 font-semibold"
                    }
                  >
                    {profile.is_verified ? "Verified" : "Pending"}
                  </span>
                </p>
              </Section>
            )}

            <button
              type="submit"
              disabled={
                createMutation.isPending || updateMutation.isPending
              }
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isEditMode ? "Update Profile" : "Create Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className="w-full border rounded-lg px-3 py-2" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea {...props} rows={4} className="w-full border rounded-lg px-3 py-2" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select {...props} className="w-full border rounded-lg px-3 py-2">
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
