import { useParams } from "react-router-dom";
import SessionVideoCall from "@/components/client/personaltraining/video/VideoSession";


const ClientVideoCallPage = () => {
  const { sessionId } = useParams();

  return (
    <div className="w-full h-screen">
      <SessionVideoCall sessionId={sessionId} />
    </div>
  );
};

export default ClientVideoCallPage