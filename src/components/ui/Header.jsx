import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogOut from "./LogOut";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = ["message1", "message2", "message3"];

  const handleTabClick = (tab) => {
    navigate(`/${tab}`);
    setDrawerOpen(false);
  };

  return (
    <header>
      <nav className="absolute top-5 right-5 flex items-center gap-3 z-50">
        <button
          onClick={() => setDrawerOpen(true)}
          className="md:hidden bg-white p-2 rounded-lg shadow"
        >
          ☰
        </button>

        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white z-40 shadow-xl
          transform transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 space-y-4">
            {tabs.map((tab) => {
              const isActive = location.pathname === `/${tab}`;

              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`block w-full text-left capitalize px-3 py-2 rounded-lg
                    ${
                      isActive
                        ? "bg-rose-100 text-rose-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
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
