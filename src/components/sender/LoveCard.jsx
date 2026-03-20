import React, { useEffect, useRef, useState } from "react";

function LoveCard({
  index,
  mode = "edit", // "edit" | "view"
  imageUrl = null,
  messageText = "",
  onImageFileChange,
  onMessageChange,
  onFlip,
}) {
  //You can upload picture
  //When clicked it will reveal the Story behind that pricture
  //When the picture should be uploaded in the firestore as URL(through Cloudinary)

  const fileInputRef = useRef(null);

  const [image, setImage] = useState(imageUrl);
  const [message, setMessage] = useState(messageText);
  const [side, setSide] = useState("front"); // front | back

  // Keep local state in sync when parent provides existing data
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    setMessage(messageText);
  }, [messageText]);

  /* ---------- IMAGE UPLOAD ---------- */
  const handleFlip = () => {
    // In edit mode, clicking an empty card should open file picker.
    if (mode === "edit" && !image) {
      fileInputRef.current?.click();
      return;
    }

    setSide((prev) => {
      const next = prev === "front" ? "back" : "front";
      onFlip?.(index, next);
      return next;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImage(preview);

    // Bubble file up to parent so it can handle upload + persistence
    onImageFileChange?.(index, file);
  };

  const handleReplaceImage = (e) => {
    e.stopPropagation(); // safety, but no longer required
    fileInputRef.current.click();
  };

  return (
    <div
      className="relative w-full h-72
                 [perspective:1200px]"
    >
      <div
        className={`absolute inset-0 transition-transform duration-700
                    [transform-style:preserve-3d]
                    ${side === "back" ? "[transform:rotateY(180deg)]" : ""}`}
      >
        {/* FRONT — IMAGE */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl
                     bg-surface-glass backdrop-blur-xl
                     [backface-visibility:hidden]"
        >
          {/* FLIP ZONE */}
          <div
            onClick={handleFlip}
            className="w-full h-full flex items-center justify-center cursor-pointer"
          >
            {image ? (
              <img
                src={image}
                alt="Love memory"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <p className="text-black text-center px-6">
                Click to upload a memory ❤️
              </p>
            )}
          </div>

          {/* NO-FLIP ZONE (edit only) */}
          {mode === "edit" && image && side === "front" && (
            <button
              onClick={handleReplaceImage}
              className="absolute bottom-3 right-3
                         bg-white/80 backdrop-blur
                         text-sm px-3 py-1 rounded-lg
                         shadow hover:bg-white"
            >
              Replace
            </button>
          )}

          {mode === "edit" && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,gif"
              hidden
              onChange={handleFileChange}
            />
          )}
        </div>

        {/* BACK — MESSAGE */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl
                     bg-surface-glass backdrop-blur-xl
                     p-8 flex items-center cursor-pointer
                     [transform:rotateY(180deg)]
                     [backface-visibility:hidden]"
          onClick={handleFlip}
        >
          {mode === "edit" ? (
            <textarea
              placeholder="Write the story behind this memory..."
              value={message}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const nextValue = e.target.value;
                setMessage(nextValue);
                onMessageChange?.(index, nextValue);
              }}
              className="w-full h-full resize-none
                         bg-white/70 rounded-xl p-3
                         text-black focus:outline-none"
            />
          ) : (
            <p className="w-full h-full bg-white/70 rounded-xl p-3 text-black whitespace-pre-wrap">
              {message || "No story added yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoveCard;
