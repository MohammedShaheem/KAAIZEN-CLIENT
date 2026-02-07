import {
  LayoutDashboard,
  Calendar,
  Users,
  Wallet,
  Contact,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/trainer/dashboard" },
  { icon: Calendar, label: "Sessions", path: "/trainer/sessions" },
  { icon: Users, label: "Clients", path: "clients" },
  { icon: Wallet, label: "Earnings", path: "earnings" },
  { icon: Contact, label: "Profile", path: "/trainer/profile" },
];

export default function Sidebar({ logout, userName = "Trainer" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (itemPath) => {
    const current = location.pathname.split("/").pop();
    return current === itemPath;
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r p-6 flex flex-col hidden lg:flex">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-slate-200 mb-3" />
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {userName}
        </h2>
        <button className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition">
          Profile
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition ${
                  isActive(item.path)
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      
      <div className="pt-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
