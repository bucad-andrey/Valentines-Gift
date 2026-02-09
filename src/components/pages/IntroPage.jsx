import React, { useEffect, useState } from "react";
import { auth } from "../utils/firestore";
import ImageUploader from "../ui/ImageUploader";
import { saveMessageWithImage } from "../utils/firestoreHelpers";

/*
  IntroPage Responsibilities:

  - UI
  - Local state
  - User interaction

  Business logic lives in helpers
*/

function IntroPage() {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  /* ---------- LOAD DRAFT ---------- */
  useEffect(() => {
    const draft = localStorage.getItem("draftMessage");
    if (draft) setMessage(draft);
  }, []);

  /* ---------- MESSAGE CHANGE ---------- */
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    localStorage.setItem("draftMessage", e.target.value);
  };

  /* ---------- IMAGE SELECT ---------- */
  const handleImageSelect = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    if (!auth.currentUser) return;

    setIsSaving(true);
    setSaveStatus(null);

    try {
      await saveMessageWithImage({
        userEmail: auth.currentUser.email,
        message,
        imageFile,
      });

      setSaveStatus("success");
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-soft to-secondary-soft py-2 px-6 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-5xl bg-sruface-glass backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-black/60">
        <div className="relative w-full">

          {/* TEXTAREA */}
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Write your heartfelt message..."
            className="w-full min-h-120 md:min-h-150 p-6 rounded-2xl bg-surface-main 
                       border border-secondary-soft focus:outline-none 
                       focus:border-border-focus text-primary-text text-lg"
          />

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`mt-4 px-6 py-3 rounded-xl font-semibold transition
              ${
                isSaving
                  ? "bg-disabled text-error cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-hover"
              }`}
          >
            {isSaving ? "Saving..." : "Save Message"}
          </button>

          {/* STATUS */}
          {saveStatus === "success" && (
            <p className="mt-3 text-success font-medium">
              Message saved successfully.
            </p>
          )}

          {saveStatus === "error" && (
            <p className="mt-3 text-error font-medium">
              Failed to save message. Please try again.
            </p>
          )}

          {/* IMAGE PREVIEW */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-6 rounded-xl max-h-80 object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default IntroPage;
