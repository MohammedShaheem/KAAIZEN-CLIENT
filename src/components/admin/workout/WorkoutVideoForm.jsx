import { useEffect, useState } from "react";
import CloudinaryVideoUpload from "./CloudinaryVideoUpload";
import { fetchWorkoutCategories } from "@/services/admin/workouts/workoutcategory";

export default function WorkoutVideoForm({ onSubmit, submitting }) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail_time: 2,
    equipment_needed: "",
    met_value: "",
    muscle_groups:[ ],
    video_url: "",
    video_public_id: "",
    duration_seconds: "",
  });

  useEffect(() => {
    fetchWorkoutCategories()
      .then((res) => setCategories(res.data.results || []))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoUploaded = (videoData) => {
    setForm((prev) => ({
      ...prev,
      ...videoData,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      met_value: parseFloat(form.met_value),
      thumbnail_time: parseFloat(form.thumbnail_time),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        name="thumbnail_time"
        type="number"
        step="0.1"
        value={form.thumbnail_time}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        placeholder="Thumbnail time (seconds)"
      />

      <input
        name="equipment_needed"
        placeholder="Equipment needed"
        value={form.equipment_needed}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      {/* <input
        name="muscle_groups"
        placeholder="Muscle groups (comma separated)"
        value={form.muscle_groups}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      /> */}

      <input
        name="met_value"
        type="number"
        step="0.1"
        placeholder="MET value"
        value={form.met_value}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <CloudinaryVideoUpload onUploaded={handleVideoUploaded} />

      {form.video_url && (
        <p className="text-sm text-green-600">
          Video uploaded successfully
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !form.video_url}
        className="px-4 py-2 bg-[#7B1FA2] text-white rounded disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save Workout Video"}
      </button>
    </form>
  );
}
