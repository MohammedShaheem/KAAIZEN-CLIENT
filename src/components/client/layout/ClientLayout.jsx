import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import { useClientProfile } from "@/hooks/client/dashboard/useClientProfile";

const THEMES = {
  purple: {
    borderMain: "#8b5cf6",
    borderMid: "#a78bfa",
    borderLight: "#c4b5fd",

    bgMain: "#8b5cf6",
    bgDark: "#7c3aed",
    bgSoft: "rgba(139, 92, 246, 0.08)",

    textAccent: "#7c3aed",
    glow: "rgba(139, 92, 246, 0.35)",
    bubble: "rgba(139, 92, 246, 0.15)",

    tooltipBg: "#7c3aed",
    logoBg: "#8b5cf6",
  },

  orange: {
    borderMain: "#f97316",
    borderMid: "#fb923c",
    borderLight: "#fed7aa",

    bgMain: "#f97316",
    bgDark: "#ea580c",
    bgSoft: "rgba(249, 115, 22, 0.1)",

    textAccent: "#ea580c",
    glow: "rgba(249, 115, 22, 0.35)",
    bubble: "rgba(249, 115, 22, 0.15)",

    tooltipBg: "#ea580c",
    logoBg: "#f97316",
  },

  black: {
  borderMain: "#0f172a",   
  borderMid: "#1e293b",    
  borderLight: "#334155", 

  bgMain: "#020617",      
  bgDark: "#020617",

  bgSoft: "rgba(15, 23, 42, 0.2)",

  textAccent: "#000000", 
  glow: "rgba(15, 23, 42, 0.6)",
  bubble: "rgba(148, 163, 184, 0.08)",

  tooltipBg: "#020617",
  logoBg: "#0f172a",

  profileName: "#020617",
  profileSubtext: "#020617",
  profileHover: "#020617",
  profileBorder: "#020617",
},

};


const ClientLayout = ({
  children,
  headerProps = {},
  theme = "purple",
}) => {
  const t = THEMES[theme] || THEMES.purple;

  const { data: profile } = useClientProfile();
  const userName = profile?.full_name ?? "User";
  const userImage = profile?.profile_picture ?? null;

  return (
    <div
      className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
      style={{
        "--border-main": t.borderMain,
        "--border-mid": t.borderMid,
        "--border-light": t.borderLight,

        "--bg-main": t.bgMain,
        "--bg-dark": t.bgDark,
        "--bg-soft": t.bgSoft,

        "--text-accent": t.textAccent,
        "--glow-color": t.glow,
        "--bubble-color": t.bubble,

        "--tooltip-bg": t.tooltipBg,
        "--logo-bg": t.logoBg,

        
        "--profile-name": t.profileName,
        "--profile-subtext": t.profileSubtext,
        "--profile-hover": t.profileHover,
        "--profile-border": t.profileBorder,

      }}
    >
      <Sidebar />

      <div className="ml-24 flex-1 overflow-auto">
        <Header {...headerProps} userName={userName} userImage={userImage} />  // ← pass it


        <div className="p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
