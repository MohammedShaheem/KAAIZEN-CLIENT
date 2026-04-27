import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { getSessionVideoToken, startSession, endSession } from "@/services/personal_training/PersonalTraining";
import { useNavigate } from "react-router-dom";



const ZEGO_APP_ID = 64844295;
const ZEGO_SERVER_SECRET = "abfc8d6e66fedd5fc5a7070c4a1a20a2";

const SessionVideoCall = ({ sessionId }) => {
  const containerRef = useRef(null);
  const zpRef = useRef(null);
  const startedRef = useRef(false);
  const initializingRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    startVideoCall();
    return () => { cleanup(); };
  }, []);

  const cleanup = async () => {
  try {
    if (startedRef.current) {
      await endSession(sessionId);
      startedRef.current = false;
    }

    
    if (zpRef.current) {
      const zp = zpRef.current;
      zpRef.current = null;           
      setTimeout(() => {
        try { zp.destroy(); } catch (_) {}  
      }, 300);
    }

    initializingRef.current = false;

    navigate("/current-plan");

  } catch (error) {
    console.error("Cleanup error:", error);
    navigate("/current-plan");
  }
};
  const startVideoCall = async () => {
  try {
    if (zpRef.current || initializingRef.current) return;
    initializingRef.current = true;

    const data = await getSessionVideoToken(sessionId);
    const { room_id, user_id, user_name } = data; // only need these from backend now

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      ZEGO_APP_ID,          
      ZEGO_SERVER_SECRET,  
      String(room_id),
      String(user_id),
      String(user_name)
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    if (!zp) {
      console.error("Invalid kitToken");
      initializingRef.current = false;
      return;
    }

    zpRef.current = zp;

    if (!startedRef.current) {
      await startSession(sessionId);
      startedRef.current = true;
    }

    zp.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      showScreenSharingButton: true,
      showPreJoinView: false,
      onLeaveRoom: async () => {
        await cleanup();
      },
    });

  } catch (error) {
    console.error("Video call failed:", error);
    initializingRef.current = false;
  }
};

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default SessionVideoCall;