import { useParams } from "react-router-dom";
import SessionVideoCall from "@/components/client/personaltraining/video/VideoSession";

const TrainerVideoCallPage = () => {
  const { sessionId } = useParams();

  return (
    <div className="w-full h-screen">
      <SessionVideoCall sessionId={sessionId} />
    </div>
  );
};

export default TrainerVideoCallPage;