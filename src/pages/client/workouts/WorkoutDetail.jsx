import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SessionVideoPlayer from "@/components/client/workout/SessionVideoPlayer";
import { getcategoryDetail } from "@/services/client/workouts";
import ClientLayout from "@/components/client/layout/ClientLayout";

export default function WorkoutDetail() {
  const { workoutId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  
  const playlistFromNav = location.state?.playlist || [];
  const startIndexFromNav = location.state?.startIndex || 0;
  const categoryId = location.state?.categoryId;
  console.log("playlistfromnav:",playlistFromNav);
  console.log("startindexfromnav:",startIndexFromNav);
  console.log("category id:",categoryId);
  

  
  const { data, isLoading } = useQuery({
    queryKey: ["fallbackPlaylist", categoryId],
    queryFn: () => getcategoryDetail(categoryId, 1),
    enabled: !playlistFromNav.length && !!categoryId,
  });

  const playlist = playlistFromNav.length
    ? playlistFromNav
    : data?.results || [];

  const startIndex = playlistFromNav.length
    ? startIndexFromNav
    : playlist.findIndex((w) => w.id === workoutId);

  if (!playlist.length && isLoading) {
    return <div className="p-4">Loading video...</div>;
  }

  if (!playlist.length) {
    return (
      <div className="p-6">
        <p className="text-red-500 mb-4">
          Playlist not found. Please go back and select a workout again.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <ClientLayout>
    <div className="p-6">
      <SessionVideoPlayer
        categoryId={categoryId}   
        workoutId={workoutId}
        playlist={playlist}
        startIndex={Math.max(startIndex, 0)}
      />

    </div>
    </ClientLayout>
  );
}
