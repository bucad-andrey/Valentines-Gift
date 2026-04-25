import React from "react";

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
    <section className="w-full min-h-screen flex flex-col items-center">

      {/* FUNCTIONALITY: letter layout */}
      <div className="relative flex justify-center items-center">

        <img
          src="/letterBG.svg"
          alt="Letter Background"
          className="w-[400px] lg:w-[700px]"
        />

        {/* FUNCTIONALITY: page indicator */}
        <div className="absolute top-6 right-8">
          {currentPage + 1}/{pages.length}
        </div>

        {/* FUNCTIONALITY: text input */}
        <textarea
          value={pages[currentPage] || ""}
          onChange={(e) => updatePage(e.target.value)}
          className="absolute w-[400px] h-[500px] bg-transparent"
        />
      </div>

      {/* FUNCTIONALITY: controls */}
      <div className="flex gap-4 mt-6">
        <button onClick={onSave}>
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button onClick={prevPage}>Prev</button>
        <button onClick={nextPage}>Next</button>
      </div>

      {/* FUNCTIONALITY: status */}
      {saveStatus === "success" && <p>Saved successfully</p>}
      {saveStatus === "error" && <p>Save failed</p>}
    </section>
  );
}