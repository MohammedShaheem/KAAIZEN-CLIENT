import * as Yup from "yup";
import TrainerOnboardingProfileLayout from "../layout/TrainerOnboardingProfileLayout";
import ClientInput from "@/components/client/inputs/ClientInput";
import ClientSelect from "@/components/client/common/ClientSelect";
import { Gender } from "@/utils/choices";
import { fullNameRule, dobRule, genderRule } from "@/validators/common.schema";
import { uploadToCloudinary } from "@/services/cloudinary/pdfUpload";
import { useState } from "react";

const schema = Yup.object({
  full_name: fullNameRule,
  date_of_birth: dobRule,
  gender: genderRule,
  bio: Yup.string().required("Bio is required"),
  experience_certificate: Yup.string().required("Certificate is required"),
});


const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;


export default function TrainerOnboardingStep1({
  formData,
  errors,
  updateFormData,
  onSubmit,
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  
  const handleCertificateUpload = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }


    try {
      setUploading(true);
      setUploadError("");

      const result = await uploadToCloudinary(file, "raw"); 
      console.log("fetched from cloudinary",result)
      updateFormData({ experience_certificate: result.secure_url });
    } catch (err) {
      setUploadError("Failed to upload certificate");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stepData = {
      full_name: formData.full_name,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      bio: formData.bio,
      experience_certificate: formData.experience_certificate,
    };

    await schema.validate(stepData);
    onSubmit(stepData);
  };

  return (
    <TrainerOnboardingProfileLayout currentStep={1}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ClientInput
          label="Full Name"
          value={formData.full_name}
          onChange={(e) => updateFormData({ full_name: e.target.value })}
          error={errors.full_name}
        />

        <ClientInput
          label="Date of Birth"
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => updateFormData({ date_of_birth: e.target.value })}
        />

        <ClientSelect
          label="Gender"
          options={Gender}
          value={formData.gender}
          onChange={(e) => updateFormData({ gender: e.target.value })}
        />

        <ClientInput
          label="Bio"
          value={formData.bio}
          onChange={(e) => updateFormData({ bio: e.target.value })}
        />

        {/*pdf Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Experience Certificate (PDF)
          </label>
          <p className="text-xs text-gray-500">
            Max file size: {MAX_FILE_SIZE_MB}MB (PDF only)
          </p>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleCertificateUpload(e.target.files[0])}
          />
          {uploading && <p className="text-sm text-gray-500">Uploading…</p>}
          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
          {formData.experience_certificate && (
            <p className="text-sm text-green-600">
              Certificate uploaded successfully
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn-primary w-full"
        >
          Continue
        </button>
      </form>
    </TrainerOnboardingProfileLayout>
  );
}
