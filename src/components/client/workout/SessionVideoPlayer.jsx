'use client';

import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  startWorkoutSession,
  sendWorkoutHeartbeat,
  completeWorkoutSession,
} from "@/services/client/workouts";

const HEARTBEAT_INTERVAL = 10;

const SessionVideoPlayer = ({ categoryId, playlist, startIndex = 0 }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const playedRef = useRef(0);
  const lastTickRef = useRef(null);
  const sessionStartedRef = useRef(false);
  const lastHeartbeatRef = useRef(0);
  const sessionIdRef = useRef(null);
  const currentVideoRef = useRef(null);

  const sessionCompletedRef = useRef(false);

  const [sessionId, setSessionId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completeError, setCompleteError] = useState(null);

  const currentVideo = playlist?.[currentIndex];
  currentVideoRef.current = currentVideo; 

  
  const flushHeartbeat = useCallback(() => {
    const sid = sessionIdRef.current;
    const vid = currentVideoRef.current;
    if (!sid || !vid || playedRef.current === 0) return;

    sendWorkoutHeartbeat({
      session_id: sid,
      workout_id: vid.id,
      effective_play_time_seconds: Math.floor(playedRef.current),
      current_video_time_seconds: Math.floor(videoRef.current?.currentTime || 0),
      is_playing: false,
    });
  }, []);

  
  const handleVideoChange = useCallback((newIndex) => {
    flushHeartbeat();
    playedRef.current = 0;
    lastTickRef.current = null;
    lastHeartbeatRef.current = 0;
    if (videoRef.current) videoRef.current.currentTime = 0;
    setCurrentIndex(newIndex);
  }, [flushHeartbeat]);

  
  const maybeSendHeartbeat = useCallback((isPlaying) => {
    const sid = sessionIdRef.current;
    const vid = currentVideoRef.current;
    if (!sid || !vid) return;

    const effectiveSeconds = playedRef.current;
    if (effectiveSeconds - lastHeartbeatRef.current >= HEARTBEAT_INTERVAL) {
      sendWorkoutHeartbeat({
        session_id: sid,
        workout_id: vid.id,
        effective_play_time_seconds: Math.floor(effectiveSeconds),
        current_video_time_seconds: Math.floor(videoRef.current?.currentTime || 0),
        is_playing: isPlaying,
      });
      lastHeartbeatRef.current = effectiveSeconds;
    }
  }, []);

  
  const handleCompleteSession = useCallback(() => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    if (sessionCompletedRef.current) return; 
    sessionCompletedRef.current = true;

    setIsCompleting(true);
    setCompleteError(null);

    completeWorkoutSession({ session_id: sid })
      .then((data) => {
        navigate("/client/session-complete", {
          state: { calories: data.calories, sessionId: data.session_id },
        });
      })
      .catch((err) => {
        console.error("Failed to complete session", err);
        
        sessionCompletedRef.current = false;
        setCompleteError("Could not save your session. Please try again.");
        setIsCompleting(false);
      });
  }, [navigate]);

  
  const sendBeaconHeartbeat = useCallback(() => {
    const sid = sessionIdRef.current;
    const vid = currentVideoRef.current;
    if (!sid || !vid || playedRef.current === 0) return;

    const payload = JSON.stringify({
      session_id: sid,
      workout_id: vid.id,
      effective_play_time_seconds: Math.floor(playedRef.current),
      current_video_time_seconds: Math.floor(videoRef.current?.currentTime || 0),
      is_playing: false,
    });
    navigator.sendBeacon(
      "/api/client/workouts/sessions/heartbeat/",
      new Blob([payload], { type: "application/json" })
    );
  }, []);

  const sendBeaconComplete = useCallback(() => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    if (sessionCompletedRef.current) return; 
    sessionCompletedRef.current = true;

    const payload = JSON.stringify({ session_id: sid });
    navigator.sendBeacon(
      "/api/client/workouts/sessions/complete/",
      new Blob([payload], { type: "application/json" })
    );
  }, []);

 
  useEffect(() => {
    const handleBeforeUnload = () => {
      sendBeaconHeartbeat();
      sendBeaconComplete();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sendBeaconHeartbeat, sendBeaconComplete]);

  
  useEffect(() => {
    return () => {
      
      sendBeaconHeartbeat();
      sendBeaconComplete();
    };
  }, [sendBeaconHeartbeat, sendBeaconComplete]);

  
  const handlePlay = useCallback(() => {
    lastTickRef.current = Date.now();

    if (sessionStartedRef.current) return;
    sessionStartedRef.current = true;

    startWorkoutSession({ category_id: categoryId })
      .then((data) => {
        setSessionId(data.session_id);
        sessionIdRef.current = data.session_id;
      })
      .catch((err) => {
        console.error("Failed to start session", err);
        sessionStartedRef.current = false; 
      });
  }, [categoryId]);

  
  const handleTimeUpdate = useCallback((e) => {
    const isPaused = e.target.paused;
    const now = Date.now();

    if (!isPaused && lastTickRef.current !== null) {
      const delta = (now - lastTickRef.current) / 1000;
     
      if (delta > 0 && delta < 2) playedRef.current += delta;
    }

    lastTickRef.current = isPaused ? null : now;
    maybeSendHeartbeat(!isPaused);
  }, [maybeSendHeartbeat]);

  
  const handlePause = useCallback(() => {
    lastTickRef.current = null;
    maybeSendHeartbeat(false);
  }, [maybeSendHeartbeat]);

  
  const handleSeeking = useCallback(() => {
    
    lastTickRef.current = null;
  }, []);

  
  const handleEnded = useCallback(() => {
    lastTickRef.current = null;

    
    const sid = sessionIdRef.current;
    const vid = currentVideoRef.current;
    if (sid && vid) {
      sendWorkoutHeartbeat({
        session_id: sid,
        workout_id: vid.id,
        effective_play_time_seconds: Math.floor(playedRef.current),
        current_video_time_seconds: Math.floor(videoRef.current?.currentTime || 0),
        is_playing: false,
      });
    }

    if (currentIndex + 1 < playlist.length) {
      
      handleVideoChange(currentIndex + 1);
    } else {
      
      handleCompleteSession();
    }
  }, [currentIndex, playlist.length, handleVideoChange, handleCompleteSession]);

  
  if (!currentVideo) return <div className="p-4">No video available</div>;

  
  return (
    <div className="flex flex-col gap-6">

      
      {completeError && (
        <div className="max-w-4xl mx-auto w-full px-4">
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
            {completeError}
            <button
              onClick={handleCompleteSession}
              className="ml-3 underline font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      
      {isCompleting && (
        <div className="max-w-4xl mx-auto w-full px-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm">
            Saving your session…
          </div>
        </div>
      )}

      
      <div className="rounded-lg border border-gray-300 overflow-hidden bg-black max-w-4xl mx-auto w-full">
        <video
          ref={videoRef}
          src={currentVideo.video_url}
          controls
          className="w-full h-auto aspect-video"
          onTimeUpdate={handleTimeUpdate}
          onPause={handlePause}
          onPlay={handlePlay}
          onSeeking={handleSeeking}
          onEnded={handleEnded}
        />
      </div>

      
      <div className="max-w-4xl mx-auto w-full px-4">
        <h2 className="text-2xl font-bold text-gray-900">{currentVideo.title}</h2>
        <p className="text-gray-600 mt-2">{currentVideo.description}</p>
      </div>

      
      <div className="max-w-4xl mx-auto w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 px-4">
          Up Next in Playlist
        </h3>
        <div className="flex flex-col gap-3 px-4">
          {playlist.map((video, index) => (
            <div
              key={video.id}
              onClick={() => handleVideoChange(index)}
              className={`flex gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                index === currentIndex
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              <div className="flex-shrink-0 w-32 h-20 bg-gray-300 rounded overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <p
                  className={`font-semibold text-sm truncate ${
                    index === currentIndex ? "text-blue-700" : "text-gray-900"
                  }`}
                >
                  {video.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {video.duration_seconds
                    ? `${Math.round(video.duration_seconds / 60)} min`
                    : "Duration N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SessionVideoPlayer;