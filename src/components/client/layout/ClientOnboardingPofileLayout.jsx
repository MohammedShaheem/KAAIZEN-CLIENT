
import { ArrowRight, Upload, User } from "lucide-react"
import { useRef } from "react"
import { uploadToCloudinary } from "@/services/cloudinary/pdfUpload"
import { useState } from "react"

const STEPS = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Fitness Details" },
  { id: 3, label: "Goal Pace" },
  { id: 4, label: "Lifestyle" },
]

export default function ClientLayout({ currentStep = 1, children, formData, updateFormData }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const inputRef = useRef(null)

  const handleImageUpload = async (file) => {
    if (!file) return

    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) {
      setUploadError("Only JPG, PNG, or WebP images are allowed")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB")
      return
    }

    try {
      setUploading(true)
      setUploadError("")
      const result = await uploadToCloudinary(file, "image")  
      updateFormData?.({ profile_picture: result.secure_url })
    } catch {
      setUploadError("Upload failed, please try again")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Column */}
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              "TELL US ABOUT <span className="text-purple-600">YOU"</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Help us personalize your experience by filling out your basic details.
            </p>
          </div>
          <div className="mb-8">{children}</div>
          <div className="flex gap-2 justify-center">
            {STEPS.map((step) => (
              <button
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all ${
                  step.id === currentStep
                    ? "bg-purple-600 w-8"
                    : step.id < currentStep
                      ? "bg-purple-600"
                      : "bg-gray-300"
                }`}
                aria-label={`Step ${step.id}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Clickable upload circle */}
        <div className="hidden lg:flex items-center justify-center relative h-96">
          <div className="absolute w-96 h-96 bg-purple-600 rounded-full opacity-20" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Hidden file input */}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />

            <div
              onClick={() => inputRef.current?.click()}
              className="relative w-80 h-80 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full 
                         flex items-center justify-center border-4 border-purple-200 shadow-lg 
                         cursor-pointer hover:border-purple-400 transition-colors group"
            >
              {formData?.profile_picture ? (
                // Show uploaded image
                <img
                  src={formData.profile_picture}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                // Show placeholder
                <div className="text-center pointer-events-none">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-purple-600 font-semibold">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <User className="w-32 h-32 text-purple-300 mx-auto mb-4 group-hover:text-purple-400 transition-colors" />
                      <p className="text-purple-600 font-semibold text-lg">Upload Photo</p>
                      <p className="text-purple-400 text-sm mt-1">JPG, PNG up to 5MB</p>
                    </>
                  )}
                </div>
              )}

              {/* Upload badge — shows a re-upload icon once image is set */}
              <div className="absolute bottom-6 right-6 bg-purple-600 rounded-full p-3 shadow-lg hover:bg-purple-700 transition-colors">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>

            {uploadError && (
              <p className="mt-3 text-sm text-red-500 text-center max-w-xs">{uploadError}</p>
            )}

            {formData?.profile_picture && !uploading && (
              <p className="mt-3 text-sm text-green-600 font-medium">✓ Photo uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}