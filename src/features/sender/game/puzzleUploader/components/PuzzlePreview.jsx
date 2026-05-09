import React from "react";

/*
  FUNCTIONALITY:
  Render uploaded image preview.
*/
export default function PuzzlePreview({ preview }) {

  if (!preview) return null;

  return (
    <div className="w-full">

      <img
        src={preview}
        alt="Puzzle Preview"
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          object-cover
        "
      />
    </div>
  );
}