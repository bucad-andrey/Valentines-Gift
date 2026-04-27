import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "../firebase/client";

const DEFAULT_EXPIRES_IN_DAYS = 7;

function buildReceiverUrl({ giftId }) {
  const baseUrl = window.location.origin;
  return `${baseUrl}/love/${giftId}`;
}

export async function createGiftLink({
  senderId,
  expiresInDays = DEFAULT_EXPIRES_IN_DAYS,
}) {
  if (!senderId) throw new Error("Missing senderId");

  const giftId = nanoid(10);
  const expiresAtMs =
    Date.now() + expiresInDays * 24 * 60 * 60 * 1000;

  const giftDoc = {
    giftId,
    senderId,
    createdAt: serverTimestamp(),
    expiresAtMs,
  };

  // Canonical mapping for receiver flow.
  await setDoc(doc(db, "Gifts", giftId), giftDoc);

  // Backward compatible location (older code expects this path to exist).
  await setDoc(doc(db, "Senders", senderId, "generatedURL", giftId), giftDoc);

  return { giftId, url: buildReceiverUrl({ giftId }) };
}

export async function resolveSenderIdFromGiftId(giftId) {
  if (!giftId) throw new Error("Missing giftId");

  const snap = await getDoc(doc(db, "Gifts", giftId));
  if (snap.exists()) {
    const data = snap.data();
    if (data?.senderId) return data.senderId;
  }

  // Backward compatibility: older links used senderId directly in the URL.
  return giftId;
}

