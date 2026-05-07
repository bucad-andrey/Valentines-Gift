import React from "react";

// FUNCTIONALITY: render save feedback
export default function LovePageStatus({
  saveStatus,
}) {

  if (saveStatus === "success") {
    return (
      <p className="text-success font-medium">
        All cards have been saved.
      </p>
    );
  }

  if (saveStatus === "error") {
    return (
      <p className="text-error font-medium">
        Failed to save cards. Please try again.
      </p>
    );
  }

  return null;
}