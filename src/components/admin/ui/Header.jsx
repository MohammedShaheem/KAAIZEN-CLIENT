import { Search, Bell } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-900">KAAIZEN</h1>
          <a href="#" className="text-[#7B1FA2] hover:underline">
            Categories
          </a>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#7B1FA2] focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={24} className="text-gray-600" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img src="/professional-avatar.png" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  )
}
