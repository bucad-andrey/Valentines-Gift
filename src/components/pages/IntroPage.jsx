import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../utils/firestore";
import ImageUploader from "../ui/ImageUploader";
import Header from "../ui/Header";


// Work on the Skeleton of the other Pages

/*
  Now I need you to come up with ideas about
  the design and the Functions inside the other
  Pages
*/


function IntroPage() {
  const [activeTab, setActiveTab] = useState("message");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [messageImage, setMessageImage] = useState(null)
  const [isSaving, setIsSaving] = useState(false);
const [saveStatus, setSaveStatus] = useState(null); // "success" | "error"

  
const saveMessageToFirestore = async () => {
  if (!auth.currentUser) return;

  setIsSaving(true);
  setSaveStatus(null);

  try {
    const userEmail = auth.currentUser.email;

    // message document
    const messageDocRef = doc(
      db,
      "Senders",
      userEmail,
      "message1",
      "message"
    );

    // image document
    const imgDocRef = doc(
      db,
      "Senders",
      userEmail,
      "message1",
      "imgURL"
    );

    await Promise.all([
      setDoc(
        messageDocRef,
        {
          value: message,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ),

      setDoc(
        imgDocRef,
        {
          value: messageImage || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ),
    ]);

    setSaveStatus("success");
  } catch (error) {
    console.error("Firestore save failed:", error);
    setSaveStatus("error");
  } finally {
    setIsSaving(false);
  }
};

  /* ---------- AUTOSAVE MESSAGE ---------- */
  useEffect(() => {
    const draft = localStorage.getItem("draftMessage");

    if (draft) setMessage(draft);
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    localStorage.setItem("draftMessage", e.target.value);
  };

  /* ---------- IMAGE UPLOAD ---------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  };

  /* ---------- CONTENT SWITCH ---------- */
  const renderContent = () => {
    switch (activeTab) {
      case "message":
        return (
          <div className="relative w-full">
            {/* IMAGE OVERLAY BUTTON */}
            <label className="absolute top-3 right-3 z-10 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-primary-hover transition">
                +
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </label>

            {/* TEXTAREA */}
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Write your heartfelt message..."
              className="w-full h-72 p-6 rounded-2xl bg-surface-main 
                         border border-secondary-soft focus:outline-none 
                         focus:border-border-focus text-primary-text text-lg z-40"
            />

<button
  onClick={saveMessageToFirestore}
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
        );

      case "image":
        return <p className="text-secondary-text">Image section</p>;
      case "voice":
        return <p className="text-secondary-text">Voice upload section</p>;
      case "song":
        return <p className="text-secondary-text">Theme song section</p>;
      case "video":
        return <p className="text-secondary-text">Video upload section</p>;
      case "preview":
        return (
          <div className="bg-surface-main p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold text-primary-hover mb-4">
              Final Preview
            </h2>
            <p className="whitespace-pre-wrap text-gray-700">{message}</p>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-6 rounded-xl"
              />
            )}
          </div>
        );

    default:
        return null;
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-soft to-secondary-soft py-2 px-6">
      <Header/>
      
      {/* MAIN CONTENT */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-5xl bg-sruface-glass backdrop-blur-xl p-8 rounded-3xl shadow-2xl z-40">
          {renderContent()}
          
        </div>
      </div>
    </section>
  );
}

export default IntroPage;
