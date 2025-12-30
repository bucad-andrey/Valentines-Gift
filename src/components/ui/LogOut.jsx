import React from 'react'

import { signOut } from "firebase/auth";
import { auth } from "../utils/firestore";

function LogOut() {
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <button 
      onClick={logOut} 
      className="bg-white px-4 py-2 rounded-lg shadow text-rose-600 hover:bg-rose-50">
        Log Out
      </button>
  )
}

export default LogOut