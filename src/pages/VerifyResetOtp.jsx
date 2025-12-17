import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useNavigate, useLocation } from "react-router-dom"
import { verifyResetOtpRequest } from "@/services/auth"
import { emailRule, otpRule } from "@/validators/common.schema"
import verifyResetOtp from "@/assets/client-images/client-otp-verify.avif" 
import { resendresetotp } from "@/services/auth"
import { useEffect,useState } from "react"

export default function VerifyResetOtp() {
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    if(cooldown > 0){
        const timer = setTimeout(() => setCooldown(cooldown-1),1000)
        return () => clearTimeout(timer)
    }
  },[cooldown])
  
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || ""

  const initialValues = {
    email: email,
    otp: "",
  }
  const validationSchema = Yup.object({
    email: emailRule,
    otp: otpRule,
  })

  const handleResensOtp = async () => {
    if(cooldown > 0 || resending) return

    setResending(true)
    setResendError("")

    try{
        await resendresetotp({ email })
        setCooldown(30)
    }catch (err) {
        setResendError(
            err.response?.data?.detail || "Failed to resend OTP"
        )
    } finally {
        setResending(false)
    }
  }

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await verifyResetOtpRequest(values)
      navigate("/reset-password", {
        replace:true,
        state: { email: values.email, resetToken: response.data.reset_token },
      })
    } catch (err) {
      setErrors({
        otp: err.response?.data?.detail || "Invalid or expired OTP",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500">Invalid session. Please start over from forgot password</p>
      </div>
    )
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">VERIFY OTP</h1>
          <p className="text-gray-500 text-center mb-8">
            Enter the 6-digit OTP sent to <strong>{email}</strong>
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

                {/* OTP Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                    </div>
                    <Field
                      name="otp"
                      type="text"
                      maxLength={6}
                      placeholder="Enter OTP"
                      className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                  <ErrorMessage name="otp" component="div" className="text-red-500 text-sm mt-1 ml-4" />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-teal-400 to-purple-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Back to Forgot Password Link */}
          <p className="text-center mt-8 text-gray-600">
            Didn't receive code?{" "}
           <button
           type="button"
           onClick={handleResensOtp}
           disabled={cooldown > 0 || resending}
           className="text-teal-500 font-semibold hover:underline disabled:text-gray-400"
           >
            {resending
            ? "Sending.."
            : cooldown > 0
            ? `Resend in${cooldown}s`
            : "Resend OTP"}
           </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={verifyResetOtp}
          alt="Yoga meditation"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
