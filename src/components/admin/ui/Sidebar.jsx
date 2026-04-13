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
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useLogout from "@/hooks/common/useLogout";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "dashboard" },
  { icon: Grid3X3, label: "Category", path: "workouts/categories" },
  { icon: Users, label: "Users", path: "clientslisting" },
  { icon: Dumbbell, label: "Trainers", path: "trainerslisting" },
  { icon: CheckCircle, label: "Verifications", path: "trainers/verification" },
  { icon: Wallet, label: "Wallet", path: "wallet-dashboard" },
  { icon: ShoppingCart, label: "Orders", path: "plans/" },
  { icon: Video, label: "Workout videos", path: "workouts/workoutvideos" },
];

export default function Sidebar({ userName = "Edwin" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();

  const handleNavigation = (path) => {
    if (path !== "#") {
      navigate(path);
    }
  };

  const getActivePath = (pathname, itemPath) => {
    const cleanPathname = pathname.split("/").pop() || "";
    return (
      cleanPathname === itemPath ||
      (itemPath === "dashboard" && cleanPathname === "")
    );
  };

  const handleLogout = () => {
    logout("/admin/login"); //admin redirect
  };

  return (
    <aside className="w-64 min-h-screen bg-[#EDE7F6] p-6 flex flex-col">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-[#7B1FA2] mb-4">
          {userName}
        </h2>
        <button className="w-full bg-[#7B1FA2] text-white py-2 px-6 rounded-lg hover:bg-[#6A1B9A] transition-colors">
          Profile
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = getActivePath(location.pathname, item.path);
            return (
              <li key={item.label}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
                    isActive
                      ? "bg-white/50 text-[#7B1FA2] font-medium"
                      : "text-gray-700 hover:bg-white/30"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="pt-4 border-t border-gray-300">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
