import { useState } from "react"
import { Field, ErrorMessage } from "formik"
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline"

const PasswordField = ({
  name = "password",
  placeholder = "Password", 
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div>
      <div className="relative w-full">
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <LockOpenIcon className="h-5 w-5" />
          ) : (
            <LockClosedIcon className="h-5 w-5" />
          )}
        </button>

        <Field
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}   
          className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
          {...props}
        />
      </div>

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1 ml-4"
      />
    </div>
  )
}

export default PasswordField
