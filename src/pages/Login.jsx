"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginRequest } from "@/services/auth"
import { GoogleLogin } from "@react-oauth/google"
import { emailRule, passwordRule } from "@/validators/common.schema"
import { setUSer, setError, clearError, setLoading } from "@/features/auth/authSlice"
import loginImage from "@/assets/client-images/client-login page image.jpg";
import { googleAuth } from "@/services/auth"



export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoading, error } = useSelector((state) => state.auth)

  const initialValues = {
    email: "",
    password: "",
  }

  const validationSchema = Yup.object({
    email: emailRule,
    password: passwordRule,
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError())
    dispatch(setLoading(true))

    try {
      const response = await loginRequest(values)
      dispatch(setUSer(response.data.user))
      navigate("/dashboard", { replace: true })
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || "Invalid email or password"))
    } finally {
      dispatch(setLoading(false))
      setSubmitting(false)
    }
  }

  const handleForgotPassword = () => {
    navigate("/forgot-password",{
      
    })
  }

  const handleSignUp = () => {
    navigate("/signup")
  }
  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    dispatch(clearError())
    dispatch(setLoading(true))

    const idToken = credentialResponse.credential

    const response = await googleAuth({
      id_token: idToken,
    })

    dispatch(setUSer(response.data.user))
    navigate("/dashboard", { replace: true })
  } catch (err) {
    dispatch(
      setError(err.response?.data?.detail || "Google login failed")
    )
  } finally {
    dispatch(setLoading(false))
  }
}


  return (
    <div className="min-h-screen h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-center mb-2 tracking-wide">LOGIN</h2>
          

          {error && <div className="text-red-500 mb-4 text-center text-sm">{error}</div>}

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* Email/Username Field */}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Username"
                      className="w-full bg-purple-50 border-0 rounded-full py-4 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1 ml-4" />
                </div>

                {/* Password Field */}
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="w-full bg-purple-50 border-0 rounded-full py-4 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                    <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Forgot Password?
                </button>
              </div>

                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1 ml-4" />
                </div>

                {/* Login Button */}
                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="px-12 py-3 rounded-xl text-white font-medium text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #14b8a6 0%, #8b5cf6 100%)",
                    }}
                  >
                    {isLoading ? "Logging in..." : "Login Now"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">
              <span className="font-semibold">Login</span> with Others
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Login Button */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                dispatch(setError("Google login failed"))
              }}
              theme="outline"
              size="large"
              shape="pill"
              width="100%"
            />
          </div>


          {/* Sign Up Link */}
          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{" "}
            <button type="button" onClick={handleSignUp} className="text-teal-500 font-medium hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 h-full">
        <img src={loginImage} alt="People practicing yoga" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}