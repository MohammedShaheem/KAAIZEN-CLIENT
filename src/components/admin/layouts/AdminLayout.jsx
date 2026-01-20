// New: pages/admin/AdminLayout.jsx (or components/admin/AdminLayout.jsx - adjust import paths accordingly)
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/ui/Sidebar";
import Header from "@/components/admin/ui/Header";

export default function AdminLayout({ userName = "Edwin" }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar userName={userName} />
        {/* Dynamic content renders here via Outlet */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}