

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useNavigate, useLocation } from "react-router-dom"
import { resetPasswordRequest } from "@/services/auth"
import { passwordRule, emailRule } from "@/validators/common.schema"
import resetPassword from "@/assets/client-images/client-setnew-password.avif"
export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  const { email, resetToken } = location.state || {}

  if (!email || !resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500">Invalid session. Please start again from Forgot Password.</p>
      </div>
    )
  }

  const initialValues = {
    email: email || "",
    new_password: "",
  }

  const validationSchema = Yup.object({
    email: emailRule,
    new_password: passwordRule,
  })

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await resetPasswordRequest({
        email: values.email,
        reset_token: resetToken,
        new_password: values.new_password,
      })
      navigate("/login", { replace: true })
    } catch (err) {
      setErrors({
        new_password: err.response?.data?.detail || "Failed to reset password. Try again",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">RESET PASSWORD</h1>
          <p className="text-gray-500 text-center mb-8">
            Enter your new password for <strong>{email}</strong>
          </p>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* Email Field (pre-filled, disabled) */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <Field
                    name="email"
                    type="email"
                    disabled
                    className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
                  />
                </div>

                {/* New Password Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <Field
                      name="new_password"
                      type="password"
                      placeholder="New Password"
                      className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                  <ErrorMessage name="new_password" component="div" className="text-red-500 text-sm mt-1 ml-4" />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-teal-400 to-purple-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Back to Login Link */}
          <p className="text-center mt-8 text-gray-600">
            Remember your password?{" "}
            <button onClick={() => navigate("/login")} className="text-teal-500 font-semibold hover:underline">
              Back to Login
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={resetPassword}
          alt="Yoga meditation"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
