const SubmitButton = ({ children, disabled, isSubmitting, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || isSubmitting}
    className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
  >
    {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
    {children}
  </button>
)

export default SubmitButton
