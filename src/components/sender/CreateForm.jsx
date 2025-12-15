import React, { useState } from "react";
import { db, auth, googleProvider } from "../utils/firestore";
import { setDoc, doc } from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";
import "./romantic.css";

function CreateForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const createSenderDocument = async (user) => {
    try {
      await setDoc(doc(db, "Senders", user.email), {
        email: user.email,
        name: user.displayName || name || "",
        createdAt: Date.now(),
      });
    } catch (err) {
      console.error("Firestore error:", err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createSenderDocument(result.user);
    } catch (err) {
      console.error(err);
    }
  };

  const createSenderWithEmail = async () => {
    // your OTP logic later
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600 overflow-hidden">

      {/* Floating heart particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="heart"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 50}px`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          ❤️
        </div>
      ))}

      {/* Card Container */}
      <div className="relative bg-white/20 backdrop-blur-lg p-10 rounded-2xl shadow-xl max-w-md w-full border border-white/30">

        {/* Heart Pattern Overlay */}
        <div className="absolute inset-0 bg-hearts rounded-2xl pointer-events-none"></div>

        <h1 className="text-3xl font-semibold text-white mb-6 relative z-10 text-center">
          Welcome, Sender
        </h1>

        <div className="flex flex-col space-y-5 relative z-10">

          <input
            type="email"
            placeholder="Enter your Email"
            className="w-full p-3 rounded-lg bg-white/70 text-black placeholder-gray-600 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter your name..."
            className="w-full p-3 rounded-lg bg-white/70 text-black placeholder-gray-600 focus:outline-none"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="OTP"
            className="w-full p-3 rounded-lg bg-white/70 text-black placeholder-gray-600 focus:outline-none"
          />

          <button
            onClick={createSenderWithEmail}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg transition-transform duration-300 hover:scale-105 shadow-lg"
          >
            Sign In
          </button>

          <button
            onClick={signInWithGoogle}
            className="w-full bg-red-400 hover:bg-red-500 text-white py-3 rounded-lg transition-transform duration-300 hover:scale-105 shadow-lg"
          >
            Sign in with Google
          </button>

          <button
            onClick={logOut}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg transition-transform duration-300 hover:scale-105"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateForm;
