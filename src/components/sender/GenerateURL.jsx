import React, { useState } from "react";
import { auth } from "../../shared/lib/firebase/client";
import { createGiftLink } from "../../shared/lib/gifts/gifts";

function GenerateURL() {
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | working | error
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setStatus("working");
    try {
      const senderId = auth?.currentUser?.uid;
      const { url } = await createGiftLink({ senderId });
      setGeneratedUrl(url);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Failed to generate link");
    }
  }

  return (
    <section className="flex justify-center items-center flex-col space-y-6">
      <button
        onClick={handleGenerate}
        disabled={status === "working"}
        className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-hover transition font-semibold disabled:opacity-60"
      >
        Generate Url
      </button>

      {error && <div className="text-error">{error}</div>}

      {generatedUrl && (
        <a href={generatedUrl} target="_blank" rel="noreferrer" className="underline text-primary-text">
          {generatedUrl}
        </a>
      )}
    </section>
  );
}

export default GenerateURL;