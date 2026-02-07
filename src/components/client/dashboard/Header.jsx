'use client';

import { Bell, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import "../../../assets/css/client_css/header.css"

const Header = ({ userName = "Thomas Fletcher", userImage = null }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [notificationBounce, setNotificationBounce] = useState(false)
  const [hoveredIcon, setHoveredIcon] = useState(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <>
      <div
        className={`fixed top-0 right-0 z-40 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
        style={{ left: "96px" }}
      >
        {/* Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-32 h-32 rounded-full blur-3xl animate-float header-bubble"
            style={{ top: "10%", left: "5%", animationDuration: "8s" }}
          />
          <div
            className="absolute w-40 h-40 rounded-full blur-3xl animate-float header-bubble"
            style={{
              top: "20%",
              right: "10%",
              animationDuration: "12s",
              animationDelay: "2s",
            }}
          />
          <div
            className="absolute w-28 h-28 rounded-full blur-3xl animate-float header-bubble"
            style={{
              bottom: "5%",
              left: "20%",
              animationDuration: "10s",
              animationDelay: "4s",
            }}
          />
          <div
            className="absolute w-36 h-36 rounded-full blur-3xl animate-float header-bubble"
            style={{
              bottom: "10%",
              right: "5%",
              animationDuration: "14s",
              animationDelay: "1s",
            }}
          />
        </div>

        <div
          className="relative flowing-border-header"
          style={{
            background: "#ffffff",
          }}
        >
          <div className="flex justify-between items-center px-8 py-3 gap-6">
            <div className="flex-1">
              <p
                className="text-sm font-medium tracking-wide uppercase animate-fade-in"
                style={{ color: "var(--text-accent)" }}
              >
                Good Morning
              </p>

              <h1 className="text-3xl font-bold text-slate-900 mt-2 animate-fade-in">
                Welcome Back
              </h1>
            </div>

            <div className="flex items-center gap-5 group">
              <button className="relative px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 active:scale-95 bg-white/70 backdrop-blur-md border profile-border hover:shadow-lg">
                <span className="relative flex items-center gap-2">
                  Subscribe
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse bg-[var(--text-accent)]"></span>
                </span>
              </button>

              <div className="w-px h-8 header-divider"></div>

              <button
                className="p-2.5 rounded-lg transition-all duration-300 relative"
                style={{
                  backgroundColor: hoveredIcon === "bell" ? "rgba(0,0,0,0.05)" : "transparent",
                }}
                onMouseEnter={() => {
                  setHoveredIcon("bell")
                  setNotificationBounce(true)
                }}
                onMouseLeave={() => {
                  setHoveredIcon(null)
                  setNotificationBounce(false)
                }}
              >
                <Bell
                  size={20}
                  className="transition-transform duration-300"
                  style={{
                    color: "var(--text-accent)",
                    transform: hoveredIcon === "bell" ? "scale(1.1)" : "scale(1)",
                  }}
                />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></span>
              </button>

              <button
                className="p-2.5 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: hoveredIcon === "plus" ? "rgba(0,0,0,0.05)" : "transparent",
                }}
                onMouseEnter={() => setHoveredIcon("plus")}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <Plus
                  size={20}
                  className="transition-transform duration-300"
                  style={{
                    color: "var(--text-accent)",
                    transform: hoveredIcon === "plus" ? "scale(1.1)" : "scale(1)",
                  }}
                />
              </button>

              <div className="flex items-center gap-3 ml-2 pl-5 border-l profile-border transition-all duration-300 group cursor-pointer">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-300 group-hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--bg-main), var(--bg-dark))",
                    boxShadow:
                      "0 8px 24px var(--glow-color)",
                  }}
                >
                  {userName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="hidden md:block">
                  <p className="profile-name font-semibold text-sm">
                    {userName}
                  </p>
                  <p className="profile-subtext text-xs">
                    Premium Member
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-0.5 header-divider"></div>
        </div>
      </div>

      <div className="header-spacer"></div>
    </>
  )
}

export default Header
