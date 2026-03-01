import { collection, getDocs, doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "../utils/firestore";

/**
 * Debug version of generateGiftURL
 * Logs every step so failures are visible.
 */
async function generateGiftURL({ senderEmail }) {
  console.log("🚀 generateGiftURL started");
  console.log("📧 senderEmail:", senderEmail);

  try {
    // 1. Resolve sender base path
    const basePath = `Senders/${senderEmail}`;
    console.log("📂 basePath:", basePath);

    // 2. Validate pages existence
    const pageNames = ["message1", "loveCards", "finalMessage"];  

    for (const page of pageNames) {
      console.log(`🔍 Checking ${page}...`);

      const snap = await getDocs(collection(db, basePath, page));

      console.log(`📄 ${page} docs count:`, snap.size);

      if (snap.empty) {
        throw new Error(`❌ Missing ${page} data`);
      }
    }

    console.log("✅ All pages found");

    // 3. Generate gift ID
    const giftId = nanoid(10);
    console.log("🆔 Generated giftId:", giftId);

    // 4. Calculate expiration
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    console.log("⏳ expiresAt:", new Date(expiresAt));

    // 5. Save gift document
    console.log("💾 Writing Firestore document...");

    await setDoc(doc(db, "Senders", senderEmail, "generatedURL", giftId), {
      senderEmail,
      createdAt: serverTimestamp(),
      expiresAt,

      refs: { basePath },

      response: null,

      analytics: {
        openedCount: 0,
        firstOpenedAt: null,
        lastOpenedAt: null,
      },
    });

    console.log("✅ Firestore write success");

    // 6. Generate URL
    const baseUrl = window.location.origin;
    const finalUrl = `${baseUrl}/love/${senderEmail}`;

    console.log("🔗 Generated URL:", finalUrl);

    return finalUrl;

  } catch (error) {
    console.error("🔥 generateGiftURL FAILED:", error);
    throw error;
  }
}

export default generateGiftURL;