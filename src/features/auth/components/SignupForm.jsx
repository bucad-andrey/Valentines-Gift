import React, { useState } from "react";
import { AUTH_VIEW } from "../hooks/constants";
import { useAuth } from "../hooks/useAuth";
import '../romantic.css';


export default function SignupForm({ navigate }) {
  const { signup, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        className="rounded-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="rounded-input"
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