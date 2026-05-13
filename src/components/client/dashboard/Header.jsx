import { Flame, Zap, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import "../../../assets/css/client_css/header.css"
import { Link } from "react-router-dom"  // add this import

const getTimeGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12)
    return { label: "Good Morning", emoji: "🌅", sub: "Rise & grind — your gains won't make themselves." }
  if (hour >= 12 && hour < 17)
    return { label: "Good Afternoon", emoji: "☀️", sub: "Midday warrior. Stay locked in." }
  if (hour >= 17 && hour < 21)
    return { label: "Good Evening", emoji: "🌆", sub: "Evening sessions hit different. Let's go." }
  return { label: "Good Night", emoji: "🌙", sub: "Rest is part of the grind. Recovery mode." }
}

const STREAK = 12 

const Header = ({ userName = "Thomas Fletcher", userImage = null, streak = STREAK }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIcon, setHoveredIcon] = useState(null)
  const [greeting, setGreeting] = useState(getTimeGreeting())
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    const interval = setInterval(() => {
      setGreeting(getTimeGreeting())
      setTick(t => t + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const firstName = userName?.split(" ")[0] ?? "Athlete"
  const initials = userName?.split(" ").map(n => n[0]).join("").toUpperCase()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

        .kaaizen-header {
          font-family: 'DM Sans', sans-serif;
        }

        .kaaizen-logo-text {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, var(--bg-main, #f97316), var(--bg-dark, #ea580c));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .greeting-emoji {
          display: inline-block;
          animation: sway 3s ease-in-out infinite;
        }

        @keyframes sway {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }

        .tagline-slide {
          animation: slideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .streak-badge {
          background: linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%);
          border-radius: 12px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }

        .streak-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 24px rgba(249, 115, 22, 0.45);
        }

        .streak-flame {
          animation: flicker 1.2s ease-in-out infinite alternate;
        }

        @keyframes flicker {
          0%   { transform: scale(1) rotate(-4deg); }
          100% { transform: scale(1.15) rotate(4deg); }
        }

        .log-workout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          background: linear-gradient(135deg, var(--bg-main, #f97316), var(--bg-dark, #ea580c));
          color: #fff;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 18px rgba(249, 115, 22, 0.35);
        }

        .log-workout-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent);
          border-radius: inherit;
        }

        .log-workout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(249, 115, 22, 0.5);
        }

        .log-workout-btn:active {
          transform: scale(0.97);
        }

        .log-workout-btn .chevron {
          transition: transform 0.2s;
        }

        .log-workout-btn:hover .chevron {
          transform: translateX(3px);
        }

        .user-name-text {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        .user-name-text span.first-name {
          background: linear-gradient(135deg, var(--bg-main, #f97316), var(--bg-dark, #ea580c));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .greeting-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-accent, #f97316);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sub-text {
          font-size: 13px;
          color: #64748b;
          margin-top: 2px;
          font-style: italic;
          font-weight: 500;
        }

        .kaaizen-tag {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: #cbd5e1;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .avatar-ring {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 13px;
          background: linear-gradient(135deg, var(--bg-main, #f97316), var(--bg-dark, #ea580c));
          box-shadow: 0 6px 20px rgba(249,115,22,0.4);
          transition: transform 0.25s;
        }

        .profile-group:hover .avatar-ring {
          transform: scale(1.1) rotate(-3deg);
        }
      `}</style>

      <div
        className={`kaaizen-header fixed top-0 right-0 z-40 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
        style={{ left: "96px" }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-32 h-32 rounded-full blur-3xl animate-float header-bubble"
            style={{ top: "10%", left: "5%", animationDuration: "8s" }} />
          <div className="absolute w-40 h-40 rounded-full blur-3xl animate-float header-bubble"
            style={{ top: "20%", right: "10%", animationDuration: "12s", animationDelay: "2s" }} />
          <div className="absolute w-28 h-28 rounded-full blur-3xl animate-float header-bubble"
            style={{ bottom: "5%", left: "20%", animationDuration: "10s", animationDelay: "4s" }} />
        </div>

        <div className="relative flowing-border-header" style={{ background: "#ffffff" }}>
          <div className="flex justify-between items-center px-8 py-3 gap-6">

           
            <div className="flex-1 flex flex-col justify-center gap-0.5">
              <div className="greeting-label">
                <span className="greeting-emoji">{greeting.emoji}</span>
                {greeting.label}
              </div>

              <div className="user-name-text tagline-slide" key={tick}>
                Let's go, <span className="first-name">{firstName}.</span>
              </div>

              <div className="sub-text tagline-slide" key={`sub-${tick}`}>
                {greeting.sub}
              </div>

              <div className="kaaizen-tag">⚡ Kaaizen — Constant Improvement</div>
            </div>

            {/* ── RIGHT: Streak + Log Workout + Profile ── */}
            <div className="flex items-center gap-4">

              {/* Streak Badge */}
              {/* <div className="streak-badge">
                <Flame size={18} className="streak-flame" style={{ color: "#fff" }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                    {streak}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Day Streak
                  </div>
                </div>
              </div> */}

              {/* Log Workout CTA
              <button className="log-workout-btn">
                <Zap size={15} style={{ flexShrink: 0 }} />
                Log Workout
                <ChevronRight size={14} className="chevron" />
              </button> */}

              <div className="w-px h-8 header-divider" />

              {/* Profile */}
              <Link
                to="/profile"
                className="profile-group flex items-center gap-3 cursor-pointer transition-all duration-300 no-underline"
              >
                <div className="avatar-ring overflow-hidden">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={userName}
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="profile-name font-semibold text-sm">{userName}</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="h-0.5 header-divider" />
        </div>
      </div>

      <div className="header-spacer" />
    </>
  )
}

export default Header