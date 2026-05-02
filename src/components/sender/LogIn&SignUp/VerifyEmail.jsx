import React from "react";
import { AUTH_VIEW } from "./constants";

export default function VerifyEmail({ navigate }) {
  console.log("Render: VerifyEmail");

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl font-bold">Verify Email</h2>

      <p>Please check your email and verify your account.</p>

      <button className="w-full bg-purple-500 text-white p-2 rounded">
        Resend Email
      </button>

      <button onClick={() => navigate(AUTH_VIEW.LOGIN)}>
        Back to Login
      </button>
    </div>
  );
}