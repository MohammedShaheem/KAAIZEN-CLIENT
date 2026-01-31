export default function MySleepCard({ latest }) {
  if (!latest) return null

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0B1D3A] to-[#08162E] p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">My Sleep</h2>
        <span className="text-blue-400 text-sm">Latest</span>
      </div>

      <h3 className="text-4xl text-white font-bold mb-4">
        {latest.hours}h
      </h3>

      <div className="text-gray-300">
        <p className="text-sm">Date</p>
        <p className="font-medium text-white">
          {new Date(latest.date).toDateString()}
        </p>
      </div>
    </div>
  )
}
