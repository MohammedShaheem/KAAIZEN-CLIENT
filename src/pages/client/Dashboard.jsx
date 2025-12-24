import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "@/services/auth";
import { clearUser } from "@/features/auth/authSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      dispatch(clearUser());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-6 bg-white shadow">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          aria-label="Logout"
        >
          Logout
        </button>
      </header>
      <main className="p-8">
        <h2 className="text-2xl font-bold">
          Welcome, {user?.email || 'User'}!
        </h2>
      </main>
    </div>
  );
}