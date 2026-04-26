import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase/client";

export function LogOut() {
  return (
    <button
      onClick={() => signOut(auth)}
      className="bg-white/70 hover:bg-white text-gray-700 px-4 py-2 rounded-lg shadow transition"
    >
      Logout
    </button>
  );
}

