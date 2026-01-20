// src/components/client/dashboard/TrackersComponent.jsx
import { Plus } from "lucide-react";

const TrackersComponent = ({ onTrackMore }) => {
  // Static for now; fetch/dynamic in future (e.g., from profile)
  const trackers = [
    { icon: "📏", label: "Weight", value: "0 kg gained", add: true },
    { icon: "🔥", label: "Workout", value: "Goal: 430 cal", add: true },
    { icon: "👟", label: "Steps", value: "Set Up Auto-Tracking", arrow: true },
    { icon: "🌙", label: "Sleep", value: "Goal: 8hr", add: true },
    { icon: "🥛", label: "Water", value: "Goal: 7 glasses", add: true },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white rounded-lg p-4 shadow-md">
      {trackers.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl">
              {item.icon}
            </div>
            <div>
              <p className="font-semibold">{item.label}</p>
              <p className="text-sm text-gray-600">{item.value}</p>
            </div>
          </div>
          {item.add ? (
            <button className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center text-gray-600">
              <Plus size={14} />
            </button>
          ) : item.arrow ? (
            <span className="text-gray-600">&gt;</span>
          ) : null}
        </div>
      ))}
      <button onClick={onTrackMore} className="flex items-center gap-2 mt-4 text-green-600">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
          <Plus size={14} />
        </div>
        Track More
      </button>
    </div>
  );
};

export default TrackersComponent;