import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { getSessionVideoToken } from "@/services/personal_training/PersonalTraining";

const SessionVideoCall = ({ sessionId }) => {
  const containerRef = useRef(null);
  const zpRef = useRef(null);

  const startedRef = useRef(false);

  useEffect(() => {
    startVideoCall();

    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
        zpRef.current = null;
      }
    };
  }, []);

  const startVideoCall = async () => {
      try {
        
        if (zpRef.current) {
          console.log("Already joined room");
          return;
        }

        const data = await getSessionVideoToken(sessionId);

        const { token, room_id, app_id, user_id, user_name } = data;

        const kitToken =
        ZegoUIKitPrebuilt.generateKitTokenForTest(
          app_id,
          import.meta.env.VITE_ZEGO_SERVER_SECRET, 
          room_id,
          user_id,
          user_name || "User"
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zpRef.current = zp; 

        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          showScreenSharingButton: true,
          showPreJoinView: false,
        });

      } catch (error) {
        console.error("Video call failed:", error);
      }
    };

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default SessionVideoCall;