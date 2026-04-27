import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/client";

export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
}

export async function saveMessageWithImage({ userEmail, message }) {
  const docRef = doc(db, "Senders", userEmail, "message1", "message");
  await setDoc(
    docRef,
    { value: message, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return message;
}

export async function saveLoveCard({ userEmail, cardId, message, imageFile = null }) {
  let uploadedImageURL = null;
  if (imageFile) uploadedImageURL = await uploadImageToCloudinary(imageFile);

  const docRef = doc(db, "Senders", userEmail, "loveCards", cardId);

  const payload = { value: message, updatedAt: serverTimestamp() };
  if (uploadedImageURL !== null) payload.image = uploadedImageURL;

  await setDoc(docRef, payload, { merge: true });
}

export async function fetchLoveCards(userEmail) {
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
}

export async function saveFinalMessage({
  userEmail,
  invitationType,
  when,
  whereImageFiles = [],
  existingWhereImages = [],
  selectedWhereIndex = null,
  dressCode = "",
  soundtrackUrl = "",
  message = "",
}) {
  if (!userEmail) throw new Error("Missing userEmail");

  const uploadedWhereImages = await Promise.all(
    whereImageFiles.map(async (file, index) => {
      if (!file) return existingWhereImages?.[index] ?? null;
      return await uploadImageToCloudinary(file);
    })
  );

  const docRef = doc(db, "Senders", userEmail, "finalMessage", "senderInvitation");

  const payload = {
    invitationType: invitationType || "",
    when: when || "",
    where: {
      selectedIndex: typeof selectedWhereIndex === "number" ? selectedWhereIndex : null,
      images: uploadedWhereImages,
    },
    dressCode: dressCode || "",
    soundtrackUrl: soundtrackUrl || "",
    message: message || "",
    createdAt: serverTimestamp(),
  };

  await setDoc(docRef, payload, { merge: true });
  return { id: docRef.id, ...payload };
}

export async function fetchLatestFinalMessage(userId) {
  if (!userId) throw new Error("Missing userEmail");

  const docRef = doc(db, "Senders", userId, "finalMessage", "senderInvitation");
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}

export async function saveFinalResponse({ userEmail, attending, message }) {
  if (!userEmail) throw new Error("Missing userEmail");

  const docRef = doc(db, "Senders", userEmail, "finalMessage", "recieverResponse");
  await setDoc(
    docRef,
    {
      receiverResponse: {
        attending: !!attending,
        message: message || "",
        createdAt: serverTimestamp(),
      },
    },
    { merge: true }
  );
}

// Kept for compatibility; not used yet.
export async function fetchLatestCollectionDoc({ userId, subcollection, orderField = "createdAt" }) {
  const colRef = collection(db, "Senders", userId, subcollection);
  const q = query(colRef, orderBy(orderField, "desc"), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function addToSubcollection({ userId, subcollection, data }) {
  const colRef = collection(db, "Senders", userId, subcollection);
  const ref = await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

