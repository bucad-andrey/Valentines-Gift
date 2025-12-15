import React, { useState } from "react";
import Alert from "../components/Alert";

export default function ShowAlert() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Reusable Alert Demo</h1>

      {showAlert && (
        <Alert
          type="success"
          message="Your message has been sent successfully!"
          onClose={() => setShowAlert(false)}
        />
      )}

      <button
        onClick={() => setShowAlert(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Show Alert Again
      </button>
    </div>
  );
}
