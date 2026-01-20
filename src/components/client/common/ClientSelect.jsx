import { ChevronDown } from "lucide-react"

const ClientSelect = ({ icon: Icon, label, options, value, onChange, error, ...props }) => (
  <div className="space-y-2 mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative flex items-center">
      {Icon && <Icon className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />}
      <select
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? "pl-12" : "px-4"} pr-10 py-3 bg-purple-50 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all appearance-none cursor-pointer`}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

export default ClientSelect
