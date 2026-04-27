import React from "react";
import { motion } from "framer-motion";
import LetterDecor from "./LetterDecor";

// FUNCTIONALITY: render UI only
export default function LetterView({
  pages,
  currentPage,
  updatePage,
  nextPage,
  prevPage,
  onSave,
  isSaving,
  saveStatus,
}) {

  
  return (
    <section className="
    w-full min-h-screen 
    lg:flex flex-col
    items-center">

      {/* FUNCTIONALITY: letter layout */}
      <div className="relative flex justify-center items-center">

        <img
          src="/letterBG.svg"
          alt="Letter Background"
          className="
          w-[400px] h-auto object-contain 
          block pointer-none
          
          lg:w-[700px] lg:h-[650px]"
        />

       {/* FUNCTIONALITY: decorative animated images (on top layer) */}
        <LetterDecor styling={"absolute inset-0 z-20 pointer-events-none flex justify-center"}/>

        {/* FUNCTIONALITY: page indicator */}
        <div className="absolute  top-1 right-2 lg:right-40 md:right-45 text-sm text-gray-700 bg-white/70 px-3 py-1 rounded-full shadow">
          {currentPage + 1}/{pages.length}
        </div>

        {/* FUNCTIONALITY: text input */}
        <textarea
          value={pages[currentPage] || ""}
          onChange={(e) => updatePage(e.target.value)}
          className="
          z-40
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

          resize-none"
        />
      </div>

       

      {/* FUNCTIONALITY: controls */}
      <div className="
        flex gap-4 mt-5 relative
        
        md:bottom-15
        md:justify-center md:z-50 
        

        lg:absolute lg:overflow-hidden
        lg:bottom-1">
        {/* Save */}
        <button 
        onClick={onSave}
        disabled={isSaving}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-80"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

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

      {/* FUNCTIONALITY: status */}
      {saveStatus === "success" && <p className="mt-2 text-green-600 md:absolute md:bottom-20 md:right-90 lg:right-1/2 z-50">Saved successfully</p>}
      {saveStatus === "error" && <p className="mt-2 text-red-600 md:absolute md:bottom-20 md:right-90 lg:right-1/2 z-50">Save failed</p>}
    </section>
  );
}