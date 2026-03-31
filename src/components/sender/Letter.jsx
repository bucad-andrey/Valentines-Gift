import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../utils/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firestore";
import { saveMessageWithImage } from "../utils/firestoreHelpers";

function Letter() {
  const [text, setText] = useState(""); // full message
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      if (!auth.currentUser) {
        const saved = localStorage.getItem("letterSent");
        if (saved) setText(saved);
        return;
      }

      try {
        const docRef = doc(
          db,
          "Senders",
          auth.currentUser.uid,
          "message1",
          "message"
        );
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setText(data?.value || "");
        } else {
          const saved = localStorage.getItem("letterSent");
          if (saved) setText(saved);
        }
      } catch (error) {
        console.error("Failed to fetch message:", error);
        const saved = localStorage.getItem("letterSent");
        if (saved) setText(saved);
      }
    };

    fetchMessage();
  }, []);

  useEffect(() => {
    localStorage.setItem("letterSent", text);
  }, [text]);

  useEffect(() => {
    const maxCharsPerPage = 500;
    const split = [];

    for (let i = 0; i < text.length; i += maxCharsPerPage) {
      split.push(text.slice(i, i + maxCharsPerPage));
    }

    setPages(split);

    // keep currentPage in range when pages change
    setCurrentPage((prev) => {
      if (split.length === 0) return 0;
      if (prev >= split.length) return split.length - 1;
      return prev;
    });
  }, [text]);

  const handleMessageChange = (e) => {
    const newPageText = e.target.value;

    const maxCharsPerPage = 500;
    const before = text.slice(0, currentPage * maxCharsPerPage);
    const after = text.slice((currentPage + 1) * maxCharsPerPage);

    const updated = before + newPageText + after;
    setText(updated);
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    setIsSaving(true);
    setSaveStatus(null);

    try {
      await saveMessageWithImage({
        userEmail: auth.currentUser.uid,
        message: text,
      });

      setSaveStatus("success");
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };


  const letterImages = { 
    left:[ "/letterFW.png" , "/letterLFW.png" , "/letterSTB.png" ], 
    right :[ "/letterHeart.png", "/letterRFW.png", "/letterStar.png", ], 
    bottom : ["/letterCC.png"]
  }; 
    
  const leftVariant = { 
    hidden: { 
      x: -100, 
      opacity: 0 }, 

    visible: (index) => ({ 
      x: 0, 
      opacity: 1, 
      transition: { delay: index * 0.2, duration: 0.6, }, 
    }), 
  }; 

  const rightVariant = { 
    hidden: { x: 100, 
      opacity: 0 }, 

    visible: (index) => ({ 
      x: 0, 
      opacity: 1, 
      transition: { delay: index * 0.2, duration: 0.6, }, 
    }), 
  }; 

  const bottomVariant = { 
    hidden: { 
      y: 100, 
      opacity: 0 },

    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, }, }, 
  };


  return (
    <section 
      className="
      w-full min-h-screen 
      
      lg:flex flex-col
      items-center">
        <div className="block lg:flex justify-center items-center relative">

          <img
            src="/letterBG.svg"
            alt="Letter Background"
            className="
            w-[400px] h-auto object-contain 
            block
            
            lg:w-[700px] lg:h-[650px]
            "
          />

          {/* Page indicator (top-right of letter area) */}
          {pages.length > 0 && (
            <div
              className="absolute top-6 right-8 text-sm text-gray-700 bg-white/70 px-3 py-1 rounded-full shadow"
            >
              {currentPage + 1}/{pages.length}
            </div>
          )}

          <textarea
            value={pages[currentPage] || ""}
            onChange={handleMessageChange}
            placeholder="Write your message here..."
            className="
                absolute top-1/2 left-1/2
                -translate-x-1/2 -translate-y-1/2
                h-[500px] w-screen md:w-[400px]
                p-16 mg:p-3 pt-16 md:pt-3 
                rounded-xl
                text-black
                outline-none

                font-[Patrick_Hand]
                text-lg
                leading-6 mg:leading-8
                tracking-wide

                bg-transparent
                overflow-y-auto
  
                resize-none

              "
            />
        </div>
   
      <div 
        className="
        flex gap-4 mt-10 
        overflow-scroll relative
        
        md:absolute md:bottom-1
        md:overflow-hidden">

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          {/* Pagination controls */}
          {pages.length > 1 && (
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={prevPage}
                className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
                disabled={currentPage === 0}
              >
                Prev
              </button>
              <button
                onClick={nextPage}
                className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
                disabled={currentPage === pages.length - 1}
              >
                Next
              </button>
            </div>
          )}
      </div>

      {saveStatus === "success" && (
        <p className="mt-2 text-green-600">Saved successfully</p>
      )}

      {saveStatus === "error" && (
        <p className="mt-2 text-red-600">Save failed</p>
      )}

    </section>
  );
}

export default Letter;