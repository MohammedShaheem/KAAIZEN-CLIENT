import { useState } from "react";
import { uploadToCloudinary } from "@/services/cloudinary/pdfUpload";

export default function CloudinaryVideoUpload({ onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const res = await uploadToCloudinary(file, "video");

      onUploaded({
        video_url: res.secure_url,
        video_public_id: res.public_id,
        duration_seconds: Math.round(res.duration),
      });
    } catch (err) {
      console.error("Video upload failed:", err);
      setError("Video upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      />

      {uploading && (
        <p className="text-sm text-gray-500">Uploading video...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
