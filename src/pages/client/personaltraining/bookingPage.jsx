import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SessionTypeStep from "@/components/client/personaltraining/sessionTypeStep";
import SlotSelectionStep from "@/components/client/personaltraining/slotSelectionStep";
import TrainerSelectionStep from "@/components/client/personaltraining/trainerSelectionStep";
import ConfirmBookingStep from "@/components/client/personaltraining/confirmBookingStep";
import ClientLayout from "@/components/client/layout/ClientLayout";

import { useSelectSessionType,useSelectSessionSlot,useSelectTrainer } from "@/hooks/client/personaltraining/publicPlan";

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();


  const sessionTypeMutation = useSelectSessionType();
  const slotMutation = useSelectSessionSlot();
  const trainerMutation = useSelectTrainer();

  const handleSessionType = (values) => {
    sessionTypeMutation.mutate(values, {
      onSuccess: (data) => {
        setSlots(data.slots || []);
        setStep(2);
      },
    });
  };

  const handleSlot = (values) => {
    slotMutation.mutate(values, {
      onSuccess: (data) => {
        setTrainers(data.available_trainers || []);
        setStep(3);
      },
    });
  };

  const handleTrainer = (values) => {
    trainerMutation.mutate(values, {
      onSuccess: () => {
        setStep(4);
      },
    });
  };

  return (
    <ClientLayout
      
      headerProps={{
        userName: "Client",
        location: "Booking ",
      }}
    >
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

      {step === 4 && <ConfirmBookingStep />}
    </div>
    </ClientLayout>
  );
};

export default BookingPage;
