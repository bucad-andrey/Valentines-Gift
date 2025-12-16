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
  const [error, setError] = useState(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const uploadToCloudinary = async (file) => {
  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data?.error?.message || "Cloudinary upload failed");
    }

    setPreview(data.secure_url);
    onUpload?.(data.secure_url);
  } catch (err) {
    setError(err.message);
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
        <span className="text-xs">Uploading...</span>
      ) : preview ? (
        <img
          src={preview}
          alt="Uploaded"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xl">+</span>
      )}

      {/* ERROR BADGE */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-xs text-white text-center px-1">
          {error}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
