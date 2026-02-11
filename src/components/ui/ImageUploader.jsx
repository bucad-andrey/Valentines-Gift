import React, { useRef, useState } from "react";

const animations = {
  pop: "animate-[pop_0.3s_ease-out]",
  fade: "animate-[fade_0.3s_ease-out]",
  "slide-left": "animate-[slideLeft_0.5s_ease-out]",
  "slide-right": "animate-[slideRight_0.5s_ease-out]",
};

function ImageUploader({
  width = "200px",
  height = "200px",
  top,
  right,
  bottom,
  left,
  zIndex = 10,
  animationType = "pop",
  initialImage = null,
  onSelect,
  mode = "manual", // "manual" = preview only, "auto" = upload instantly
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(initialImage);

  /* ---------- OPEN FILE PICKER ---------- */
  const handleClick = () => {
    inputRef.current?.click();
  };

  /* ---------- HANDLE FILE SELECTION ---------- */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    // show preview instantly
    setPreview(previewURL);

    // pass raw file back to parent
    onSelect?.(file);
  };

  return (
    <div
      style={{ top, right, bottom, left, width, height, zIndex }}
      className={`rounded-full bg-primary text-white shadow-lg cursor-pointer
      flex items-center justify-center overflow-hidden
      ${animations[animationType]}`}
      onClick={handleClick}
    >
      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={handleFileChange}
      />

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xl">+</span>
      )}
    </div>
  );
}

export default ImageUploader;
