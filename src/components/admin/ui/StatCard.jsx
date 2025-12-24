export default function StatCard({ title, value, prefix = "" }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[120px] hover:shadow-md transition-shadow">
      <span className="text-2xl md:text-3xl font-bold text-gray-900">
        {prefix}
        {value}
      </span>
      <span className="text-sm text-gray-500 mt-2 text-center">{title}</span>
    </div>
  )
}
