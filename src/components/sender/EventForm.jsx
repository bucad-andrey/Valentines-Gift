import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firestore";
import ImageUploader from "../ui/ImageUploader";


function EventForm() {
  const [activeTab, setActiveTab] = useState("message");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [messageImage, setMessageImage] = useState(null)
  

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

  /* ---------- LOGOUT ---------- */
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
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
                         focus:border-rose-400 text-gray-800 text-lg"
            />

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

      {/* HEADER */}
      <div className="absolute top-5 right-5 flex items-center gap-3 z-20">
        {/* BURGER MENU (MOBILE ONLY) */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="md:hidden bg-white p-2 rounded-lg shadow"
        >
          ☰
        </button>

        {/* LOGOUT */}
        <button
          onClick={logOut}
          className="bg-white px-4 py-2 rounded-lg shadow text-rose-600 hover:bg-rose-50"
        >
          Log out
        </button>
      </div>

      {/* DRAWER OVERLAY */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-40 shadow-xl
        transform transition-transform duration-300
        ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 space-y-4">
          {["message", "image", "voice", "song", "video", "preview"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setDrawerOpen(false);
                }}
                className={`block w-full text-left capitalize px-3 py-2 rounded-lg
                ${
                  activeTab === tab
                    ? "bg-rose-100 text-rose-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Upload container */}
      <div className="relative">
        
  <ImageUploader
    top="12px"
    right="12px"
    animationType="pop"
    onUpload={(url) => setMessageImage(url)}
  />

  <textarea className="w-full h-72 p-6 rounded-2xl" />
</div>


      {/* MAIN CONTENT */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-5xl bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default EventForm;
