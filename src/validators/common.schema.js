import * as Yup from "yup";

export const emailRule = Yup.string()
  .email("Invalid email address")
  .required("Email is required");

export const passwordRule = Yup.string()
  .min(6, "Minimum 6 characters")
  .required("Password is required");

export const otpRule = Yup.string()
  .length(6, "OTP must be 6 digits")
  .required("OTP is required");