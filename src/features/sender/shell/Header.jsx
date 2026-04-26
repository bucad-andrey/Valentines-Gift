import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../app/routes";
import { LogOut } from "../../../shared/ui/LogOut";

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { key: "letter", label: "letter", to: ROUTES.sender.letter },
    { key: "preLetter", label: "preLetter", to: ROUTES.sender.preLetter },
    { key: "message2", label: "message2", to: ROUTES.sender.message2 },
    { key: "message3", label: "message3", to: ROUTES.sender.message3 },
    { key: "generateUrl", label: "generateUrl", to: ROUTES.sender.generateUrl },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? "bg-white/70 shadow-sm" : "bg-transparent"}
      `}
    >
      <nav className="flex items-center space-x-5 justify-end-safe px-4 py-3 md:px-8">
        <button
          onClick={() => setDrawerOpen(true)}
          className="md:hidden bg-white p-2 rounded-lg shadow"
        >
          ☰
        </button>

        <div className="hidden md:flex items-center gap-6">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.to;
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.to)}
                className={`
                  capitalize font-medium transition
                  ${
                    isActive
                      ? "text-rose-600 border-b-2 border-rose-600"
                      : "text-gray-600 hover:text-rose-500"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <LogOut />
      </nav>

      <div
        onClick={() => setDrawerOpen(false)}
        className={`
          fixed inset-0 bg-black/40 z-40 transition-opacity
          ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl
          transform transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 space-y-4">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.to;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  navigate(tab.to);
                  setDrawerOpen(false);
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
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

