import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogOut from "./LogOut";

function Header() {
  /* =========================
     STATE
  ========================== */

  // Controls mobile drawer (burger menu)
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Tracks scroll position for glass effect
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* =========================
     NAVIGATION TABS
  ========================== */

  const tabs = [
    "envelope",
    "pictureMessage",
    "message1",
    "message2",
    "message3",
    "game1",
    "game2",
    "game3",
    "preview",
  ];

  /* =========================
     SCROLL LISTENER
     Desktop glass effect trigger
  ========================== */

  useEffect(() => {
    const onScroll = () => {
      // Toggle glass effect when scrolling down
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =========================
     RENDER
  ========================== */

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? "backdrop-blur-md bg-white/70 shadow-sm" : "bg-transparent"}
      `}
    >
      <nav className="flex items-center space-x-5 justify-end-safe px-4 py-3 md:px-8">

        {/* =========================
           MOBILE: BURGER BUTTON
           Hidden on md+
        ========================== */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="md:hidden bg-white p-2 rounded-lg shadow"
        >
          ☰
        </button>

        {/* =========================
           DESKTOP: INLINE TABS (md+)
        ========================== */}
        <div className="hidden md:flex items-center gap-6">
          {tabs.map((tab) => {
            const isActive = location.pathname === `/${tab}`;

            return (
              <button
                key={tab}
                onClick={() => navigate(`/${tab}`)}
                className={`
                  capitalize font-medium transition
                  ${
                    isActive
                      ? "text-rose-600 border-b-2 border-rose-600"
                      : "text-gray-600 hover:text-rose-500"
                  }
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* =========================
           LOGOUT (Always visible)
        ========================== */}
        <LogOut />
      </nav>

      {/* =========================
         MOBILE OVERLAY
      ========================== */}
      <div onClick={() => setDrawerOpen(false)}
        className={`
          fixed inset-0 bg-black/40 z-40 transition-opacity
          ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* =========================
         MOBILE DRAWER
      ========================== */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl
          transform transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 space-y-4">
          {tabs.map((tab) => {
            const isActive = location.pathname === `/${tab}`;

            return (
              <button
                key={tab}
                onClick={() => {
                  navigate(`/${tab}`);
                  setDrawerOpen(false); // close drawer on navigation
                }}
                className={`
                  block w-full text-left capitalize px-3 py-2 rounded-lg
                  ${
                    isActive
                      ? "bg-rose-100 text-rose-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Header;
