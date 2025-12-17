import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import { forgotPasswordRequest } from "@/services/auth"
import { emailRule } from "@/validators/common.schema"
import ForgetPasswordImage from "@/assets/client-images/forgot-password-client.avif" 

export default function ForgotPassword() {
  const navigate = useNavigate()

  const initialValues = {
    email: "",
  }

  const validationSchema = Yup.object({
    email: emailRule,
  })

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await forgotPasswordRequest(values)
      if(!response.data.otp_sent){
        setErrors({
          email:"If the mail exists, you will receive an OTP shortly"
        })
        return
      }

      navigate("/verify-reset-otp", {
        replace:true,
        state: { email: values.email,
         },
      })
    } catch (err) {
      setErrors({
        email: err.response?.data?.detail || "Something went wrong. Please try again",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black text-center mb-2 tracking-wide">FORGOT PASSWORD</h2>
          <p className="text-gray-500 text-center mb-8">Enter your email to receive a reset OTP</p>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                <div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email"
                      className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-full outline-none focus:ring-2 focus:ring-purple-200 transition"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1 ml-4" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-purple-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send OTP"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-center mt-8 text-gray-600">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-teal-500 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 h-full">
        <img
          src={ForgetPasswordImage}
          alt="Forgot password illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}