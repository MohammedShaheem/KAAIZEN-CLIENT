import {
  LayoutDashboard,
  Grid3X3,
  Users,
  Dumbbell,
  CheckCircle,
  Wallet,
  ShoppingCart,
  Video,
  Apple,
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Grid3X3, label: "Category" },
  { icon: Users, label: "Users" },
  { icon: Dumbbell, label: "Trainers" },
  { icon: CheckCircle, label: "Verifications" },
  { icon: Wallet, label: "Wallet" },
  { icon: ShoppingCart, label: "Orders" },
  { icon: Video, label: "Workout videos" },
  { icon: Apple, label: "Foods" },
]

export default function Sidebar({ userName = "Edwin" }) {
  return (
    <aside className="w-64 min-h-screen bg-[#EDE7F6] p-6 flex flex-col">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-[#7B1FA2] mb-4">{userName}</h2>
        <button className="w-full bg-[#7B1FA2] text-white py-2 px-6 rounded-lg hover:bg-[#6A1B9A] transition-colors">
          Profile
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active ? "bg-white/50 text-[#7B1FA2] font-medium" : "text-gray-700 hover:bg-white/30"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
