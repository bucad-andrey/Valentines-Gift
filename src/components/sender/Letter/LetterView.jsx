import React from "react";
import { motion } from "framer-motion";

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

  // FUNCTIONALITY: image config with fixed positions
const letterImages = {
  left: [
    { src: "/letterFW.png"},
    { src: "/letterLFW.png"},
    { src: "/letterSTB.png"},
  ],
  right: [
    { src: "/letterHeart.png"},
    { src: "/letterRFW.png"},
    { src: "/letterStar.png"},
  ],
  bottom: [
    { src: "/letterCC.png"},
  ],
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
    <section className="
    w-full min-h-screen 
    bg-gradient-to-br from-primary-soft to-secondary-soft
    lg:flex flex-col
    items-center">

      {/* FUNCTIONALITY: letter layout */}
      <div className="relative flex justify-center items-center">

        <img
          src="/letterBG.svg"
          alt="Letter Background"
          className="
          w-[400px] h-auto object-contain 
          block
          
          lg:w-[700px] lg:h-[650px]"
        />

       {/* FUNCTIONALITY: decorative animated images (on top layer) */}
        <div className="absolute inset-0 z-20 pointer-events-none flex justify-center">

          {/* LEFT */}
          {letterImages.left.map((item, index) => (
          <motion.img
            key={`left-${index}`}
            src={item.src}
            className={`absolute w-[400px] h-auto object-contain 
                        block lg:w-[700px] lg:h-[650px]`}

            variants={leftVariant}
            initial="hidden"
            animate="visible"
            custom={index}
          />
          ))}

          {/* RIGHT */}
          {letterImages.right.map((item, index) => (
          <motion.img
            key={`right-${index}`}
            src={item.src}
            className={`absolute w-[400px] h-auto object-contain 
                        block lg:w-[700px] lg:h-[650px]`}

            variants={rightVariant}
            initial="hidden"
            animate="visible"
            custom={index}
          />
          ))}

          {/* BOTTOM */}
          {letterImages.bottom.map((item, index) => (
          <motion.img
            key={`bottom-${index}`}
            src={item.src}
            className={`absolute w-[400px] h-auto object-contain 
                        block lg:w-[700px] lg:h-[650px] md:hidden`}

            variants={bottomVariant}
            initial="hidden"
            animate="visible"
          />
          ))}

        </div>

        {/* FUNCTIONALITY: page indicator */}
        <div className="absolute top-6 right-8 text-sm text-gray-700 bg-white/70 px-3 py-1 rounded-full shadow">
          {currentPage + 1}/{pages.length}
        </div>

        {/* FUNCTIONALITY: text input */}
        <textarea
          value={pages[currentPage] || ""}
          onChange={(e) => updatePage(e.target.value)}
          className="
          z-90
          absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          h-[500px] w-screen md:w-[400px]
          p-16 mg:p-3 pt-16 md:pt-3 
          rounded-xl
          text-black
          outline-none
          border

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
        flex gap-4 mt-5 
        overflow-scroll relative
        
        md:absolute md:bottom-1
        md:overflow-hidden">
        
        {/* Save */}
        <button 
        onClick={onSave}
        disabled={isSaving}
        className="px-4 py-2 bg-green-500 text-white rounded"
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
      {saveStatus === "success" && <p className="mt- text-green-600">Saved successfully</p>}
      {saveStatus === "error" && <p className="mt- text-red-600">Save failed</p>}
    </section>
  );
}