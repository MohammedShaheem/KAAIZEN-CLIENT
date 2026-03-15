import { useState } from "react";
import { createReminder } from "@/services/notifications/createReminder";

export default function ReminderToggle({ reminderType }) {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState("10:00");

  const handleToggle = async () => {
    const newState = !enabled;
    setEnabled(newState);

    try {
      await createReminder({
        reminder_type: reminderType,
        reminder_time: `${time}:00`,
        is_active: newState,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label>
        Reminder Time:
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </label>

      <button
        onClick={handleToggle}
        className={`px-4 py-2 rounded ${
          enabled ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        {enabled ? "Enabled" : "Enable Reminder"}
      </button>
    </div>
  );
}