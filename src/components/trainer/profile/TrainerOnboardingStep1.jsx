'use client';

import * as Yup from "yup";
import TrainerOnboardingProfileLayout from "../layout/TrainerOnboardingProfileLayout";
import ClientInput from "@/components/client/inputs/ClientInput";
import ClientSelect from "@/components/client/common/ClientSelect";
import { Gender } from "@/utils/choices";
import { fullNameRule, dobRule, genderRule } from "@/validators/common.schema";
import { uploadToCloudinary } from "@/services/cloudinary/pdfUpload";
import { useState } from "react";
import { Calendar, Clock, FileText, Upload, Briefcase } from 'lucide-react';

const schema = Yup.object({
  full_name: fullNameRule,
  date_of_birth: dobRule,
  gender: genderRule,
  experience_years: Yup.number()
    .min(0, "Experience years must be at least 0")
    .max(70, "Please enter a valid number")
    .required("Experience years is required"),
  bio: Yup.string().required("Bio is required"),
  experience_certificate: Yup.string().required("Certificate is required"),
  shift_type: Yup.string()
    .oneOf(["morning", "evening", "both"])
    .required("Shift type is required"),
});

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const SHIFT_OPTIONS = [
  { value: "morning", label: "Morning", time: "5:00 AM - 10:00 AM" },
  { value: "evening", label: "Evening", time: "4:00 PM - 10:00 PM" },
  { value: "both", label: "Both Shifts", time: "5:00 AM - 10:00 AM & 4:00 PM - 10:00 PM" },
];

export default function TrainerOnboardingStep1({
  formData,
  errors,
  updateFormData,
  onSubmit,
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [localErrors, setLocalErrors] = useState({});

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
      updateFormData({ experience_certificate: result.secure_url });
    } catch {
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
      experience_years: formData.experience_years,
      bio: formData.bio,
      experience_certificate: formData.experience_certificate,
      shift_type: formData.shift_type,
    };

    try {
      await schema.validate(stepData, { abortEarly: false });
      setLocalErrors({});
      onSubmit(stepData);
    } catch (err) {
      if (err.inner) {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        setLocalErrors(fieldErrors);
      }
    }
  };

  const combinedErrors = { ...errors, ...localErrors };
  const selectedShift = SHIFT_OPTIONS.find(opt => opt.value === formData.shift_type);

  return (
    <TrainerOnboardingProfileLayout currentStep={1}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <ClientInput
          label="Full Name"
          value={formData.full_name}
          onChange={(e) => updateFormData({ full_name: e.target.value })}
          error={combinedErrors.full_name}
          placeholder="Enter your full name"
        />

        {/* Date of Birth with Modern Calendar */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Date of Birth
            </div>
          </label>
          <input
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => updateFormData({ date_of_birth: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            style={{
              colorScheme: 'light',
            }}
          />
          {combinedErrors.date_of_birth && (
            <p className="text-sm text-red-500">{combinedErrors.date_of_birth}</p>
          )}
        </div>

        {/* Gender */}
        <ClientSelect
          label="Gender"
          options={Gender}
          value={formData.gender}
          onChange={(e) => updateFormData({ gender: e.target.value })}
          error={combinedErrors.gender}
        />

        {/* Years of Experience */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Years of Experience
            </div>
          </label>
          <input
            type="number"
            min="0"
            max="70"
            value={formData.experience_years || ""}
            onChange={(e) => updateFormData({ experience_years: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., 5"
          />
          {combinedErrors.experience_years && (
            <p className="text-sm text-red-500">{combinedErrors.experience_years}</p>
          )}
        </div>

        {/* Bio */}
        <ClientInput
          label="Bio"
          value={formData.bio}
          onChange={(e) => updateFormData({ bio: e.target.value })}
          error={combinedErrors.bio}
          placeholder="Tell us about yourself"
        />

        {/* Preferred Shift - Modern Styled */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Preferred Shift
            </div>
          </label>
          
          <div className="grid grid-cols-1 gap-2">
            {SHIFT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.shift_type === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="shift_type"
                  value={option.value}
                  checked={formData.shift_type === option.value}
                  onChange={(e) => updateFormData({ shift_type: e.target.value })}
                  className="mt-1 cursor-pointer"
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{option.time}</p>
                </div>
              </label>
            ))}
          </div>

          {combinedErrors.shift_type && (
            <p className="text-sm text-red-500">{combinedErrors.shift_type}</p>
          )}
        </div>

        {/* Certificate Upload - Modern Card Style */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Experience Certificate (PDF)
            </div>
          </label>
          
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors bg-gradient-to-br from-gray-50 to-white">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleCertificateUpload(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <Upload className="w-8 h-8 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Drop your PDF here or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max file size: {MAX_FILE_SIZE_MB}MB (PDF only)
                </p>
              </div>
            </div>
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Uploading…
            </div>
          )}

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          )}

          {formData.experience_certificate && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <p className="text-sm text-green-700">Certificate uploaded successfully</p>
            </div>
          )}

          {combinedErrors.experience_certificate && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{combinedErrors.experience_certificate}</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
        >
          {uploading ? "Processing..." : "Continue"}
        </button>
      </form>
    </TrainerOnboardingProfileLayout>
  );
}