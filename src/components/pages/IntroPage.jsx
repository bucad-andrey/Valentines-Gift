import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../utils/firestore";
import ImageUploader from "../ui/ImageUploader";
import Header from "../ui/Header";


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
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow hover:bg-rose-600 transition">
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
              className="w-full h-72 p-6 rounded-2xl bg-white/70 
                         border border-rose-200 focus:outline-none 
                         focus:border-rose-400 text-gray-800 text-lg z-100"
            />

<button
  onClick={saveMessageToFirestore}
  disabled={isSaving}
  className={`mt-4 px-6 py-3 rounded-xl font-semibold transition
    ${
      isSaving
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-rose-500 text-white hover:bg-rose-600"
    }`}
>
  {isSaving ? "Saving..." : "Save Message"}
</button>
{saveStatus === "success" && (
  <p className="mt-3 text-green-600 font-medium">
    Message saved successfully.
  </p>
)}

{saveStatus === "error" && (
  <p className="mt-3 text-red-600 font-medium">
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
        return <p className="text-gray-700">Image section</p>;
      case "voice":
        return <p className="text-gray-700">Voice upload section</p>;
      case "song":
        return <p className="text-gray-700">Theme song section</p>;
      case "video":
        return <p className="text-gray-700">Video upload section</p>;
      case "preview":
        return (
          <div className="bg-white/70 p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold text-rose-600 mb-4">
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
    <div className="max-h-screen bg-gradient-to-br from-rose-100 to-pink-200 py-2 px-6">
      <Header/>
      
      {/* MAIN CONTENT */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-5xl bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl z-50">
          {renderContent()}
          
        </div>
      </div>
</div>
  );
}

export default IntroPage;
