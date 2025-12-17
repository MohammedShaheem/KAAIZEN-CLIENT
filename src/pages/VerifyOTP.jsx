import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { verifyOtpRequest } from "@/services/auth"
import { setUSer } from "@/features/auth/authSlice"
import { emailRule, otpRule } from "@/validators/common.schema"
import { useState, useRef, useEffect } from "react"

export default function VerifyOTP() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const inputRefs = useRef([])

  const [timer, setTimer] = useState(56)
  const [otpValues, setOtpValues] = useState(["", "", "", "", ""])

  const emailFromState = location.state?.email

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  if (!emailFromState) {
    navigate("/signup", { replace: true })
    return null
  }

  const initialValues = {
    email: emailFromState,
    otp: "",
  }

  const validationSchema = Yup.object({
    email: emailRule,
    otp: otpRule,
  })

  const handleOtpChange = (index, value, setFieldValue) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues]
      newOtpValues[index] = value
      setOtpValues(newOtpValues)
      setFieldValue("otp", newOtpValues.join(""))

      // Auto-focus next input
      if (value && index < 4) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResendOtp = () => {
    setTimer(56)
    setOtpValues(["", "", "", "", ""])
  }

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await verifyOtpRequest(values)
      dispatch(setUSer(response.data.user))
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setErrors({
        otp: err.response?.data?.detail || "Invalid or expired OTP",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500/50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-8 tracking-wide">VERIFY YOUR ACCOUNT</h2>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Hidden email field to preserve form data */}
              <Field name="email" type="hidden" />

              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3, 4].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={otpValues[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value, setFieldValue)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-semibold bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                ))}
              </div>

              <ErrorMessage name="otp" component="div" className="text-red-500 text-sm text-center" />

              <div className="text-center text-gray-500 text-sm">00:{timer.toString().padStart(2, "0")}</div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full text-white font-semibold text-lg"
                style={{
                  background: "linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%)",
                }}
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="text-center text-sm text-gray-600">
                OTP is Time Out ?{" "}
                <button type="button" onClick={handleResendOtp} className="font-bold text-gray-800 hover:underline">
                  RESEND OTP
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
