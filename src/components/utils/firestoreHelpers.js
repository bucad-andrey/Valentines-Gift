import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./firestore";

/*
  Upload image to Cloudinary.

  Responsibilities:
  - Accept raw File object
  - Upload to Cloudinary
  - Return secure image URL

  @param {File} file
  @returns {Promise<string>} secure_url
*/
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

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

  return data.secure_url;
};

/*
  Save message + image URL into Firestore.

  Responsibilities:
  - Build Firestore path
  - Upload image if provided
  - Save message + image url + timestamp

  @param {Object} params
  @param {string} params.userEmail
  @param {string} params.message
  @param {File|null} params.imageFile
*/
export const saveMessageWithImage = async ({
  userEmail,
  message,
  imageFile = null,
}) => {
  let uploadedImageURL = null;

  // Upload only if image exists
  if (imageFile) {
    uploadedImageURL = await uploadImageToCloudinary(imageFile);
  }

  const docRef = doc(
    db,
    "Senders",
    userEmail,
    "message1",
    "message"
  );

  await setDoc(
    docRef,
    {
      value: message,
      image: uploadedImageURL,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return uploadedImageURL;
};

/*
  Save a single LovePage card (image + message) into Firestore.

  Path:
    Senders/{userEmail}/loveCards/{cardId}

  Each document stores:
    - value: string (message text)
    - image: string | null (Cloudinary URL)
    - updatedAt: Firestore timestamp

  @param {Object} params
  @param {string} params.userEmail
  @param {string} params.cardId      // e.g. "card-0", "card-1"
  @param {string} params.message
  @param {File|null} params.imageFile
*/
export const saveLoveCard = async ({
  userEmail,
  cardId,
  message,
  imageFile = null,
}) => {
  let uploadedImageURL = null;

  // Upload only if a new image file is provided
  if (imageFile) {
    uploadedImageURL = await uploadImageToCloudinary(imageFile);
  }

  const docRef = doc(db, "Senders", userEmail, "loveCards", cardId);

  const payload = {
    value: message,
    updatedAt: serverTimestamp(),
  };

  // Only touch the image field if we actually uploaded something.
  // This keeps existing images intact when editing just the text.
  if (uploadedImageURL !== null) {
    payload.image = uploadedImageURL;
  }

  await setDoc(docRef, payload, { merge: true });
};

/*
  Fetch all LovePage cards for a user.

  Path:
    Senders/{userEmail}/loveCards/*

  Returns an array of:
    { id, value, image }
*/
export const fetchLoveCards = async (userEmail) => {
  const colRef = collection(db, "Senders", userEmail, "loveCards");
  const snapshot = await getDocs(colRef);

  const cards = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    cards.push({
      id: docSnap.id,
      value: data?.value || "",
      image: data?.image || null,
    });
  });

  return cards;
};
