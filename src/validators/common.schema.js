import * as Yup from "yup";
import { Gender, FitnessGoal, WorkoutExperience, PreferredWorkoutType, GoalSpeed, DietPreference, DailyActivityLevel } from "@/utils/choices";

export const emailRule = Yup.string()
  .email("Invalid email address")
  .required("Email is required");

export const passwordRule = Yup.string()
  .min(6, "Minimum 6 characters")
  .required("Password is required");

export const roleRule = (allowedRoles) =>
  Yup.string()
  .oneOf(allowedRoles, 'Invalid role for this login portal')
  .required()

export const otpRule = Yup.string()
  .length(6, "OTP must be 6 digits")
  .required("OTP is required");


export const fullNameRule = Yup.string()
  .trim()
  .matches(/^[a-zA-Z\s'-]+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes")
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must not exceed 100 characters")
  .required("Full name is required");

export const phoneRule = Yup.string()
  .required("Phone is required")
  .transform((value) => value?.replace(/\D/g, '')) 
  .test('len', 'Phone number must be exactly 10 digits', (value) => /^\d{10}$/.test(value || ''))
  .matches(/^\d{10}$/, "Phone number must be exactly 10 digits");

export const dobRule = Yup.date()
  .nullable()
  .required("Date of birth is required")
  .max(new Date(), "Date of birth cannot be in the future")
  .typeError("Date of birth must be a valid date");

export const genderRule = Yup.string()
  .oneOf(Gender.map(g => g.value), "Please select a valid gender")
  .required("Gender is required");


export const heightCmRule = Yup.number()
  .positive("Height must be greater than 0")
  .min(50, "Height must be at least 50 cm")
  .max(250, "Height must be less than 250 cm")
  .required("Height is required");

export const weightKgRule = Yup.number()
  .positive("Weight must be greater than 0")
  .min(20, "Weight must be at least 20 kg")
  .max(300, "Weight must be less than 300 kg")
  .required("Weight is required");

export const fitnessGoalRule = Yup.string()
  .oneOf(FitnessGoal.map(g => g.value), "Please select a valid fitness goal")
  .required("Fitness goal is required");

export const workoutExperienceRule = Yup.string()
  .oneOf(WorkoutExperience.map(e => e.value), "Please select a valid experience level")
  .required("Workout experience is required");

export const preferredWorkoutTypeRule = Yup.string()
  .oneOf(PreferredWorkoutType.map(t => t.value), "Please select a valid workout type")
  .required("Preferred workout type is required");


export const goalSpeedRule = Yup.string()
  .oneOf(GoalSpeed.map(s => s.value), "Please select a valid goal pace")
  .required("Goal pace is required");


export const dietPreferenceRule = Yup.string()
  .oneOf(DietPreference.map(d => d.value), "Please select a valid diet preference")
  .required("Diet preference is required");

export const dailyActivityLevelRule = Yup.string()
  .oneOf(DailyActivityLevel.map(a => a.value), "Please select a valid activity level")
  .required("Daily activity level is required");

export const medicalConditionsRule = Yup.string()
  .trim()
  .max(500, "Medical conditions description must be less than 500 characters")
  .optional();

