import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "@/features/auth/authSlice";
import { logoutRequest } from "@/services/auth/auth";

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async (redirectTo) => {
    try {
      await logoutRequest();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      dispatch(clearUser());
      navigate(redirectTo, { replace: true });
    }
  };

  return logout;
}
