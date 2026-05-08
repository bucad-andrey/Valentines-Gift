import React, { useState } from "react";
import { AUTH_VIEW } from "../hooks/constants";
import { useAuth } from "../hooks/useAuth";

export default function ForgotPassword({ navigate }) {
  const { resetPassword, loading, error } = useAuth();

  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await resetPassword(email);
      alert("Reset email sent!");
    } catch {}
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reset Password</h2>

      <input
        className="w-full border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleReset}
        className="w-full bg-orange-500 text-white p-2"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <button onClick={() => navigate(AUTH_VIEW.LOGIN)}>
        Back
      </button>
    </div>
  );
}