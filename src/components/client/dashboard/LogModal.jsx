// src/components/client/meals/LogMealModal.jsx
import { useState } from "react";
import { X } from "lucide-react";
import SubmitButton from "@/components/ui/SubmitButton";
import IconWrapper from "@/components/common/IconWrapper";
import { UtensilsCrossed } from "lucide-react";

const LogMealModal = ({ isOpen, onClose, mealType, onSubmit }) => {
  const [foodDescription, setFoodDescription] = useState("");
  const [timeEaten, setTimeEaten] = useState(new Date().toISOString().slice(11, 16))

  const [dateEaten, setDateEaten] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!foodDescription.trim()) return;

    setSubmitting(true);
    
    
    let [hours, minutes] = timeEaten.split(':');
    hours = hours.padStart(2, '0');
    minutes = minutes.padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:00`;


    await onSubmit({
      food_description: foodDescription,
      meal_type: mealType,
      date_eaten: dateEaten,
      time_eaten: `${timeEaten}:00`, 

    });
    setSubmitting(false);
    setFoodDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold capitalize">
            Add {mealType.replace("_", " ")}
          </h3>
          <button onClick={onClose} className="text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <IconWrapper icon={UtensilsCrossed}>
            <input
              type="text"
              placeholder="What did you eat? (e.g. 2 chapati + dal + salad)"
              value={foodDescription}
              onChange={(e) => setFoodDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
          </IconWrapper>

          <input
            type="time"
            value={timeEaten}
            onChange={(e) => setTimeEaten(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />
        </div>

        <div className="mt-6">
          <SubmitButton 
            onClick={handleSubmit} 
            isSubmitting={submitting}
            disabled={!foodDescription.trim()}
          >
            Log Meal
          </SubmitButton>
        </div>
      </div>
    </div>
  );
};

export default LogMealModal;