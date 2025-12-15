import React, { useRef, useState } from "react";

const animations = {
  pop: "animate-[pop_0.3s_ease-out]",
  fade: "animate-[fade_0.3s_ease-out]",
  "slide-left": "animate-[slideLeft_0.3s_ease-out]",
  "slide-right": "animate-[slideRight_0.3s_ease-out]",
};

function ImageUploader({
  width = "48px",
  height = "48px",
  top,
  right,
  bottom,
  left,
  zIndex = 50,
  animationType = "pop",
  initialImage = null,
  onUpload,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(initialImage);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    inputRef.current.click();
  };

  const uploadToCloudinary = async (file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    // 🔴 REPLACE THESE
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setPreview(data.secure_url);
      onUpload?.(data.secure_url);
    } catch (err) {
      console.error("Cloudinary upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    uploadToCloudinary(file);
  };

  return (
    <div
      style={{
        position: "absolute",
        top,
        right,
        bottom,
        left,
        width,
        height,
        zIndex,
      }}
      className={`rounded-full bg-rose-500 text-white shadow-lg cursor-pointer
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

      {loading ? (
        <span className="text-xs">...</span>
      ) : preview ? (
        <img
          src={preview}
          alt="Uploaded"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xl">+</span>
      )}
    </div>
  );
}

export default ImageUploader;
