import { useEffect, useState } from "react";

import {
  savePuzzleDraft,
  getPuzzleDraft,
  clearPuzzleDraft,
} from "../utils/puzzleLocalStorage";

import {
  uploadPuzzleImage,
  cleanupOldPuzzleImages,
} from "../services/puzzleUploaderService";

/*
  FUNCTIONALITY:
  Convert file into base64 string.
*/
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = reject;
  });
};

export default function usePuzzleUploader(userEmail) {

  const [imageFile, setImageFile] = useState(null);

  const [preview, setPreview] = useState("");

  const [uploadedUrl, setUploadedUrl] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState("");

  /*
    FUNCTIONALITY:
    Restore draft on mount.
  */
  useEffect(() => {

    const draft = getPuzzleDraft();

    if (!draft) return;

    setPreview(draft.preview || "");
    setUploadedUrl(draft.uploadedUrl || "");

  }, []);

  /*
    FUNCTIONALITY:
    Handle image selection.
  */
  const handleImageChange = async (event) => {

    try {

      setError("");

      const file = event.target.files?.[0];

      if (!file) return;

      console.group("[PuzzleUploader]");
      console.log("Selected file:", file);

      // FUNCTIONALITY:
      // validate file type
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Unsupported image type.");
      }

      // FUNCTIONALITY:
      // validate file size
      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        throw new Error("Image exceeds 5MB limit.");
      }

      // FUNCTIONALITY:
      // convert image into base64
      const base64 = await fileToBase64(file);

      // FUNCTIONALITY:
      // update local state
      setImageFile(file);
      setPreview(base64);

      // FUNCTIONALITY:
      // persist local draft
      savePuzzleDraft({
        preview: base64,
        uploadedUrl: "",
      });

      console.log("Draft saved locally");

      console.groupEnd();

    } catch (error) {

      console.error("[PuzzleUploader] image selection error:", error);

      setError(error.message);
    }
  };

  /*
    FUNCTIONALITY:
    Upload image + save to Firestore.
  */
  const handleSave = async () => {

    try {

      if (!userEmail) {
        throw new Error("Missing userEmail");
      }

      if (!imageFile) {
        throw new Error("No image selected");
      }

      setError("");
      setIsUploading(true);

      console.group("[PuzzleUploader]");
      console.log("Uploading image...");

      // FUNCTIONALITY:
      // upload image + save firestore
      const cloudinaryUrl = await uploadPuzzleImage({
        userEmail,
        imageFile,
      });

      // FUNCTIONALITY:
      // cleanup old uploads
      await cleanupOldPuzzleImages(userEmail);

      // FUNCTIONALITY:
      // update states
      setUploadedUrl(cloudinaryUrl);

      // FUNCTIONALITY:
      // replace local draft with final cloudinary url
      savePuzzleDraft({
        preview: cloudinaryUrl,
        uploadedUrl: cloudinaryUrl,
      });

      console.log("Upload complete");

      console.groupEnd();

    } catch (error) {

      console.error("[PuzzleUploader] upload error:", error);

      setError(error.message);

    } finally {

      setIsUploading(false);
    }
  };

  /*
    FUNCTIONALITY:
    Remove image.
  */
  const handleRemove = () => {

    console.group("[PuzzleUploader]");
    console.log("Removing image");
    console.groupEnd();

    setImageFile(null);
    setPreview("");
    setUploadedUrl("");
    setError("");

    clearPuzzleDraft();
  };

  return {
    preview,
    uploadedUrl,
    isUploading,
    error,
    handleImageChange,
    handleSave,
    handleRemove,
  };
}