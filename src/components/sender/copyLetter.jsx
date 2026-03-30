import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../utils/firestore";
import { saveMessageWithImage } from "../utils/firestoreHelpers";

function CopyLetter() {

  /*
  ============================================
  STATE MANAGEMENT
  ============================================
  */

  const [text, setText] = useState(""); // full message
  const [pages, setPages] = useState([]); // split pages
  const [currentPage, setCurrentPage] = useState(0); // page index
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isViewing, setIsViewing] = useState(false); // edit vs view mode
  const [animatedText, setAnimatedText] = useState(""); // typing animation


  /*
  ============================================
  LOAD FROM LOCAL STORAGE
  ============================================
  */

  useEffect(() => {
    const saved = localStorage.getItem("letterSent");
    if (saved) setText(saved);
  }, []);


  /*
  ============================================
  SAVE TO LOCAL STORAGE
  ============================================
  */

  useEffect(() => {
    localStorage.setItem("letterSent", text);
  }, [text]);


  /*
  ============================================
  SPLIT TEXT INTO PAGES
  (simulate real letter pages)
  ============================================
  */

  useEffect(() => {
    const maxCharsPerPage = 500; // tweak this
    const split = [];

    for (let i = 0; i < text.length; i += maxCharsPerPage) {
      split.push(text.slice(i, i + maxCharsPerPage));
    }

    setPages(split);

    console.log("DEBUG: Pages Generated ->", split.length);
  }, [text]);


  /*
  ============================================
  TYPEWRITER EFFECT (VIEW MODE)
  ============================================
  */

  useEffect(() => {
    if (!isViewing) return;

    let index = 0;
    setAnimatedText("");

    const currentText = pages[currentPage] || "";

    const interval = setInterval(() => {
      setAnimatedText((prev) => prev + currentText[index]);
      index++;

      if (index >= currentText.length) {
        clearInterval(interval);
      }
    }, 60); // speed of typing

    return () => clearInterval(interval);
  }, [isViewing, currentPage, pages]);


  /*
  ============================================
  HANDLE INPUT CHANGE
  ============================================
  */

  const handleMessageChange = (e) => {
    setText(e.target.value);
  };


  /*
  ============================================
  SAVE TO FIRESTORE
  ============================================
  */

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


  /*
  ============================================
  PAGE NAVIGATION
  ============================================
  */

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


  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">

      {/* ============================================
          LETTER CONTAINER
      ============================================ */}
      <div className="relative">

        <img
          src="/letterBG.svg"
          alt="Letter Background"
          className="h-[700px] object-contain"
        />

        {/* ============================================
            EDIT MODE (TEXTAREA)
        ============================================ */}
        {!isViewing && (
          <textarea
            value={text}
            onChange={handleMessageChange}
            placeholder="Write your message here..."
            className="
              absolute top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              h-[500px] w-[400px]
              p-8 pt-12
              rounded-xl
              text-black
              outline-none

              font-[Patrick_Hand]
              text-lg
              leading-8
              tracking-wide

              bg-transparent
              overflow-y-auto

              resize-none

            "
            style={{
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 28px,
                rgba(0,0,0,0.1) 29px
              )`,
            }}
          />
        )}

        {/* ============================================
            VIEW MODE (ANIMATED TEXT)
        ============================================ */}
        {isViewing && (
          <div
            className="
              absolute top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              h-[500px] w-[400px]
              p-8 pt-12

              font-[Patrick_Hand]
              text-lg
              leading-8
              tracking-wide
              text-black

              whitespace-pre-wrap
            "
          >
            {animatedText}
          </div>
        )}
      </div>


      {/* ============================================
          CONTROLS
      ============================================ */}
      <div className="mt-4 flex gap-4">

        {/* Toggle Mode */}
        <button
          onClick={() => setIsViewing((prev) => !prev)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isViewing ? "Edit" : "Preview"}
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        {/* Pagination */}
        {isViewing && (
          <>
            <button onClick={prevPage} className="px-3 py-2 bg-gray-300 rounded">
              Prev
            </button>
            <button onClick={nextPage} className="px-3 py-2 bg-gray-300 rounded">
              Next
            </button>
          </>
        )}
      </div>


      {/* ============================================
          STATUS
      ============================================ */}
      {saveStatus === "success" && (
        <p className="mt-2 text-green-600">Saved successfully</p>
      )}

      {saveStatus === "error" && (
        <p className="mt-2 text-red-600">Save failed</p>
      )}

    </div>
  );
}

export default CopyLetter;