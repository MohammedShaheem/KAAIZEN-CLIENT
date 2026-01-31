'use client';

import { useRef, useState, useEffect } from "react";

import {
  startWorkoutSession,
  sendWorkoutHeartbeat,
  completeWorkoutSession,
} from "@/services/client/workouts";

const HEARTBEAT_INTERVAL = 10; 

const SessionVideoPlayer = ({
  categoryId,
  playlist,
  startIndex = 0,
}) => {
  const videoRef = useRef(null);
  const playedRef = useRef(0);
  const sessionStartedRef = useRef(false);

  const [sessionId, setSessionId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [lastHeartbeat, setLastHeartbeat] = useState(0);

  const currentVideo = playlist?.[currentIndex];

  /* ------------------ start Session ------------------ */
  useEffect(() => {
    if (!categoryId) return;
    if (sessionStartedRef.current) return;

    sessionStartedRef.current = true;

    startWorkoutSession({ category_id: categoryId })
      .then((data) => {
        console.log("Session started:", data);
        setSessionId(data.session_id);
      })
      .catch((err) => {
        console.error("Failed to start session", err);
      });
  }, [categoryId]);

  /* ------------------ reset on Video Change ------------------ */
  useEffect(() => {
    setLastHeartbeat(0);
    playedRef.current = 0;

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [currentIndex]);

  /* ------------------ heartbeat Logic ------------------ */
  const maybeSendHeartbeat = (seconds, isPlaying) => {
    if (!sessionId || !currentVideo) return;

    if (seconds - lastHeartbeat >= HEARTBEAT_INTERVAL) {
      sendWorkoutHeartbeat({
        session_id: sessionId,
        workout_id: currentVideo.id,
        effective_play_time_seconds: Math.floor(seconds),
        current_video_time_seconds: Math.floor(seconds),
        is_playing: isPlaying,
      });

      setLastHeartbeat(seconds);
    }
  };

  /* ------------------ cleanup on Unmount ------------------ */
  useEffect(() => {
    return () => {
      if (sessionId && currentVideo) {
        sendWorkoutHeartbeat({
          session_id: sessionId,
          workout_id: currentVideo.id,
          effective_play_time_seconds: Math.floor(
            playedRef.current
          ),
          current_video_time_seconds: Math.floor(
            playedRef.current
          ),
          is_playing: false,
        });
      }
    };
  }, [sessionId, currentVideo]);

  if (!currentVideo) {
    return <div className="p-4">No video available</div>;
  }

  /* ------------------ render ------------------ */
  return (
    <div className="flex flex-col gap-6">
      {/* Video Player Container - Cinema Mode */}
      <div className="rounded-lg border border-gray-300 overflow-hidden bg-black max-w-4xl mx-auto w-full">
        <video
          ref={videoRef}
          src={currentVideo.video_url}
          controls
          className="w-full h-auto aspect-video"
          onTimeUpdate={(e) => {
            const seconds = e.target.currentTime;
            playedRef.current = seconds;
            maybeSendHeartbeat(seconds, !e.target.paused);
          }}
          onPause={(e) => {
            maybeSendHeartbeat(
              e.target.currentTime,
              false
            );
          }}
          onEnded={() => {
            // final heartbeat for this video
            sendWorkoutHeartbeat({
              session_id: sessionId,
              workout_id: currentVideo.id,
              effective_play_time_seconds: Math.floor(
                playedRef.current
              ),
              current_video_time_seconds: Math.floor(
                playedRef.current
              ),
              is_playing: false,
            });

            // next video OR complete session
            if (
              currentIndex + 1 <
              playlist.length
            ) {
              setCurrentIndex(
                (i) => i + 1
              );
            } else {
              completeWorkoutSession({
                session_id: sessionId,
              });
            }
          }}
        />
      </div>

      {/* Video Info */}
      <div className="max-w-4xl mx-auto w-full px-4">
        <h2 className="text-2xl font-bold text-gray-900">{currentVideo.title}</h2>
        <p className="text-gray-600 mt-2">{currentVideo.description}</p>
      </div>

      {/* Playlist Section */}
      <div className="max-w-4xl mx-auto w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 px-4">Up Next in Playlist</h3>
        <div className="flex flex-col gap-3 px-4">
          {playlist.map((video, index) => (
            <div
              key={video.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                index === currentIndex
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              <div className="flex-shrink-0 w-32 h-20 bg-gray-300 rounded overflow-hidden">
                {/* Thumbnail placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{index + 1}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <p className={`font-semibold text-sm truncate ${
                  index === currentIndex ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {video.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{video.duration || 'Duration N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionVideoPlayer;
