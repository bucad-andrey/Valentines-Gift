import React from "react";

// FUNCTIONALITY: page heading + save controls
export default function LovePageHeader({
  onSave,
  isSaving,
}) {

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <h2 className="text-2xl font-semibold text-primary-text">
        Your picture memories
      </h2>

      <button
        onClick={onSave}
        disabled={isSaving}
        className={`px-6 py-3 rounded-xl font-semibold transition
          ${
            isSaving
              ? "bg-disabled text-error cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-hover"
          }`}
      >
        {isSaving ? "Saving..." : "Save all cards"}
      </button>

    </div>
  );
}