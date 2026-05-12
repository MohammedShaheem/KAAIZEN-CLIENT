import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import SessionTypeStep from "@/components/client/personaltraining/booking/sessionTypeStep";
import SlotSelectionStep from "@/components/client/personaltraining/booking/slotSelectionStep";
import TrainerSelectionStep from "@/components/client/personaltraining/booking/trainerSelectionStep";
import StartDateStep from "@/components/client/personaltraining/booking/StartDateStep";
import ConfirmBookingStep from "@/components/client/personaltraining/booking/confirmBookingStep";
import ClientLayout from "@/components/client/layout/ClientLayout";

import {
  useSelectSessionType,
  useSelectSessionSlot,
  useSelectTrainer,
  useSelectStartDate,
  useClientPlans,
} from "@/hooks/client/personaltraining/publicPlan";

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();

  const { data: clientPlans = [], isLoading: plansLoading } = useClientPlans();

  const sessionTypeMutation = useSelectSessionType();
  const slotMutation = useSelectSessionSlot();
  const trainerMutation = useSelectTrainer();
  const startDateMutation = useSelectStartDate();

  useEffect(() => {
  if (plansLoading) return;

  const paidPlan = clientPlans.find( (p) => p.status === "paid" || p.status === "active");

  if (paidPlan?.is_active === true) {
    navigate("/current-plan", { replace: true });
  }
}, [clientPlans, plansLoading, navigate]);

    
if (plansLoading) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
    </div>
  );
}


if (clientPlans.length === 0) {
  return (
    <ClientLayout headerProps={{ userName: "Client", location: "Booking" }}>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
        <p className="text-gray-600 font-medium">
          You don't have any training plan yet.
        </p>
        <button
          onClick={() => navigate("/training-plans")}
          className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Browse Plans
        </button>
      </div>
    </ClientLayout>
  );
}


const paidPlan = clientPlans.find((p) => p.status === "paid");
if (!paidPlan) {
  return (
    <ClientLayout headerProps={{ userName: "Client", location: "Booking" }}>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
        <p className="text-yellow-700 font-medium">
          You don't have an active paid plan. Please purchase a plan to start booking.
        </p>
        <button
          onClick={() => navigate("/training-plans")}
          className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Browse Plans
        </button>
      </div>
    </ClientLayout>
  );
}

  const handleSessionType = (values) => {
    sessionTypeMutation.mutate(values, {
      onSuccess: (data) => {
        if (data?.no_trainers) {
          toast.error(data.message);
          return;
        }
        setSlots(data.slots || []);
        setStep(2);
      },
    });
  };

  const handleSlot = (values) => {
    slotMutation.mutate(values, {
      onSuccess: (data) => {
        if (data?.no_trainers) {
          toast.error(data.message);
          return;
        }
        setTrainers(data.available_trainers || []);
        setStep(3);
      },
    });
  };

  const handleTrainer = (values) => {
    trainerMutation.mutate(values, {
      onSuccess: () => setStep(4),
    });
  };

  const handleStartDate = (values) => {
    startDateMutation.mutate(values, {
      onSuccess: () => setStep(5),
    });
  };

  return (
    <ClientLayout headerProps={{ userName: "Client", location: "Booking" }}>
      <div className="booking-page">
        {step === 1 && (
          <SessionTypeStep
            onSubmit={handleSessionType}
            isLoading={sessionTypeMutation.isPending}
          />
        )}
        {step === 2 && (
          <SlotSelectionStep
            slots={slots}
            onSubmit={handleSlot}
            isLoading={slotMutation.isPending}
          />
        )}
        {step === 3 && (
          <TrainerSelectionStep
            trainers={trainers}
            onSubmit={handleTrainer}
            isLoading={trainerMutation.isPending}
          />
        )}
        {step === 4 && (
          <StartDateStep
            onSubmit={handleStartDate}
            isLoading={startDateMutation.isPending}
          />
        )}
        {step === 5 && <ConfirmBookingStep />}
      </div>
    </ClientLayout>
  );
};

export default BookingPage;