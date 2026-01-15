import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogOut from "./LogOut";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = ["message1", "message2", "message3", "preview"];

  return (
    <header className="fixed top-0 right-0 z-50">
      <nav className="flex items-center gap-3 p-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="md:hidden bg-white p-2 rounded-lg shadow"
        >
          ☰
        </button>

        <div
          className={`fixed inset-0 bg-black/40 z-30 transition-opacity
            ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setDrawerOpen(false)}
        />

        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white z-100 shadow-xl
            transform transition-transform duration-300
            ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 space-y-4">
            {tabs.map((tab) => {
              const isActive = location.pathname === `/${tab}`;

              return (
                <button
                  key={tab}
                  onClick={() => {
                    navigate(`/${tab}`);
                    setDrawerOpen(false);
                  }}
                  className={`block w-full text-left capitalize px-3 py-2 rounded-lg
                    ${isActive
                      ? "bg-rose-100 text-rose-600"
                      : "text-gray-600 hover:bg-gray-100"}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <LogOut />
      </nav>
    </header>
  );
}


export default Header;
