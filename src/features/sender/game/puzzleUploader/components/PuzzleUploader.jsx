import React from "react";

import usePuzzleUploader from "../hooks/usePuzzleUploader";

import PuzzlePreview from "./PuzzlePreview";

/*
  FUNCTIONALITY:
  Main puzzle uploader UI component.
*/
export default function PuzzleUploader({
  userEmail,
}) {

  const {
    preview,
    isUploading,
    error,
    handleImageChange,
    handleSave,
    handleRemove,
  } = usePuzzleUploader(userEmail);

  return (
    <section className="flex justify-center items-center">
      <div
        className="
          flex
          flex-col
          gap-4
          p-4
          rounded-2xl
          border
          w-full
          max-w-lg
        "
      >

        {/* FUNCTIONALITY:
            image picker
        */}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
        />

        {/* FUNCTIONALITY:
            image preview
        */}
        <PuzzlePreview preview={preview} />

        {/* FUNCTIONALITY:
            error display
        */}
        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        {/* FUNCTIONALITY:
            action buttons
        */}
        <div className="flex gap-2">

          <button
            onClick={handleSave}
            disabled={isUploading}
            className="
              px-4
              py-2
              rounded-xl
              bg-black
              text-white
              disabled:opacity-50
            "
          >
            {isUploading ? "Uploading..." : "Save"}
          </button>

          <button
            onClick={handleRemove}
            className="
              px-4
              py-2
              rounded-xl
              border
            "
          >
            Remove
          </button>
        </div>
      </div>
    </section>
  );
}