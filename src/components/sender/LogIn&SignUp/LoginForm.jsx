// FUNCTIONALITY: login UI + firebase integration
import React, { useState } from "react";
import { AUTH_VIEW } from "./constants";
import { useAuth } from "./useAuth";
import "./romantic.css";

export default function LoginForm({ navigate }) {
  const { login, loading, error, signInWithGoogle } = useAuth();

  // FUNCTIONALITY: local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // FUNCTIONALITY: handle submit
  const handleLogin = async () => {
    try {
      console.log("Attempt Login:", email);

      await login(email, password);

      // TODO: redirect to dashboard
    } catch (err) {
      console.log("Handled Login Error");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold cursor-default" onClick={() => navigate(AUTH_VIEW.LOGIN)}>Login</h2>

      {/* INPUTS */}
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

      <p className="text-blue-500 cursor-pointer text-right w-fit" onClick={() => navigate(AUTH_VIEW.FORGOT_PASSWORD)}>
        Forgot Password?
      </p>

      {/* ERROR DISPLAY */}
      {error && <p className="text-red-500">{error}</p>}

      {/* LOGIN BUTTON */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full text-white p-2 rounded"
      >
        {loading ? "Loading..." : "Login"}
      </button>

      <button onClick={signInWithGoogle}
        className="w-full bg-green-500 text-white p-2 rounded">
        <span className="flex items-center gap-2 justify-center">
          <img src="/google.webp" alt="Google" className="w-5 h-5" /> 
          <span className="text-white">Login with Google</span>
        </span>
      </button>


      <button onClick={() => navigate(AUTH_VIEW.SIGNUP)} className="w-full bg-red-500 text-white p-2 rounded">
        Create new account
      </button>

    </div>
  );
}