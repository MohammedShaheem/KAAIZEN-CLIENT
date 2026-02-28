import {
  Home,
  Clock,
  Briefcase,
  CheckCircle,
  MessageCircle,
  Dumbbell,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import useLogout from "@/hooks/common/useLogout";
import "../../../assets/css/client_css/sidebar.css";
import { useNavigate } from "react-router-dom";
import { useClientCurrentPlan } from "@/hooks/client/personaltraining/publicPlan";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);

  const logout = useLogout();
  const navigate = useNavigate();

  
  const { data: currentPlan, isLoading, isError } = useClientCurrentPlan();

  const menuItems = [
    { icon: Home, label: "Home", path: "/Dashboard" },
    { icon: Dumbbell, label: "Training", path: "/workout_categories" },
    { icon: Clock, label: "History" },
    { icon: CheckCircle, label: "Progress", path: "/profile" },
    { icon: Briefcase, label: "Plans", key: "plans" }, 
    { icon: MessageCircle, label: "Messages",path:"/ai-plan" },
  ];

  const handleLogout = () => {
    logout("/login");
  };

    const handleMenuClick = (item, idx) => {
    setActiveItem(idx);

    console.log("currentplan:",currentPlan);
    

    
    if (item.path) {
      navigate(item.path);
      return;
    }

    
    if (item.key === "plans") {
      if (currentPlan) {
        navigate("/current-plan");
      } else {
        navigate("/training-plans");
      }
    }
  };


  return (
    <div className="gym-sidebar">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>

      {/* Logo */}
      <div className="logo-container">
        <div className="logo">kaaizen</div>
      </div>

      {/* Menu */}
      <div className="menu-container">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleMenuClick(item, idx)}
            onMouseEnter={() => setHoveredItem(idx)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`menu-item ${
              activeItem === idx ? "active" : ""
            } ${hoveredItem === idx ? "hovered" : ""}`}
            title={item.label}
            disabled={item.key === "plans" && isLoading}
          >
            {activeItem === idx && <div className="active-bg"></div>}

            <item.icon size={24} className="menu-icon" />

            {hoveredItem === idx && (
              <div className="tooltip">{item.label}</div>
            )}
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        onMouseEnter={() => setHoveredItem("logout")}
        onMouseLeave={() => setHoveredItem(null)}
        className="logout-btn"
        title="Logout"
      >
        <LogOut size={24} />

        {hoveredItem === "logout" && (
          <div className="tooltip logout-tooltip">Logout</div>
        )}
      </button>
    </div>
  );
};

export default Sidebar;
