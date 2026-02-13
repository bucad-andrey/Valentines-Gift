import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "../firebase";

async function generateGiftURL({ page1, page2, page3, senderId }) {
  // 1. Generate secure random ID
  const giftId = nanoid(10);

  // 2. Save everything in Firestore
  await setDoc(doc(db, "gifts", giftId), {
    senderId,
    createdAt: serverTimestamp(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,

    page1,
    page2,
    page3,

    response: null,
  });

  // 3. Generate shareable URL
  const baseUrl = window.location.origin;
  return `${baseUrl}/love/${giftId}`;
}

export default generateGiftURL;
