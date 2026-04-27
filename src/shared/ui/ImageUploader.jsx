import { useEffect, useRef, useState } from "react";

const animations = {
  pop: "animate-[pop_0.3s_ease-out]",
  fade: "animate-[fade_0.3s_ease-out]",
  "slide-left": "animate-[slideLeft_0.5s_ease-out]",
  "slide-right": "animate-[slideRight_0.5s_ease-out]",
};

export default function ImageUploader({
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
  mode = "manual",
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(initialImage);

  useEffect(() => {
    setPreview(initialImage);
  }, [initialImage]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
    onSelect?.(file);
  };

  return (
    <div
      style={{ top, right, bottom, left, width, height, zIndex }}
      className={`rounded-3xl bg-primary text-white shadow-lg cursor-pointer
      flex items-center justify-center overflow-hidden
      ${animations[animationType]}`}
      onClick={handleClick}
    >
      <input type="file" accept="image/*" hidden ref={inputRef} onChange={handleFileChange} />

      {preview ? (
        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <span className="text-xl">+</span>
      )}
    </div>
  );
}

