import React, { useState } from "react";
import { AUTH_VIEW } from "./constants";
import { useAuth } from "./useAuth";

export default function SignupForm({ navigate }) {
  const { signup, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const createSenderDocument = async (user) => {
    try {
      await setDoc(doc(db, "Senders", user.uid), {
        email: user.email,
        name: user.displayName || name || "",
        createdAt: Date.now(),
      });
    } catch (err) {
      console.error("Firestore error:", err);
    }
  };

  const handleSignup = async () => {
    try {
      await signup(email, password);
      

      // FUNCTIONALITY: go to verify screen
      navigate(AUTH_VIEW.VERIFY_EMAIL);
    } catch (err) {
      console.log("Signup failed");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Signup</h2>

      <input
        className="w-full border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-green-500 text-white p-2 rounded"
      >
        {loading ? "Creating..." : "Signup"}
      </button>

      <button onClick={() => navigate(AUTH_VIEW.LOGIN)}>
        Back to Login
      </button>
    </div>
  );
}