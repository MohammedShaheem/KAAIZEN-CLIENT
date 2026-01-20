const ClientTextArea = ({ icon: Icon, label, value, onChange, error, ...props }) => (
  <div className="space-y-2 mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative flex items-start">
      {Icon && <Icon className="absolute left-4 top-3 w-5 h-5 text-gray-400" />}
      <textarea
        value={value}
        onChange={onChange}
        rows={3}
        className={`w-full ${Icon ? "pl-12" : "px-4"} pr-4 py-3 bg-purple-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all resize-none`}
        {...props}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

export default ClientTextArea
