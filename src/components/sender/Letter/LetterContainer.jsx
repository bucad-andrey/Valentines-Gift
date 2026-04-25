import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firestore";
import { doc, getDoc } from "firebase/firestore";
import { saveMessageWithImage } from "../../utils/firestoreHelpers";
import { useLetter } from "./useLetter";
import LetterView from "./LetterView";

// FUNCTIONALITY: fetch message from firestore or localStorage
async function fetchMessage() {
  if (!auth.currentUser) {
    return localStorage.getItem("letterSent") || "";
  }

  try {
    const ref = doc(
      db,
      "Senders",
      auth.currentUser.uid,
      "message1",
      "message"
    );

    const snap = await getDoc(ref);

    if (snap.exists()) return snap.data()?.value || "";

    return localStorage.getItem("letterSent") || "";
  } catch {
    return localStorage.getItem("letterSent") || "";
  }
}

export default function LetterContainer() {
  const letter = useLetter("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // FUNCTIONALITY: load initial data
  useEffect(() => {
    fetchMessage().then((msg) => {
      letter.setText(msg);
    });
  }, []);

  // FUNCTIONALITY: persist locally
  useEffect(() => {
    localStorage.setItem("letterSent", letter.text);
  }, [letter.text]);

  // FUNCTIONALITY: save to firestore
  const handleSave = async () => {
    if (!auth.currentUser) return;

    setIsSaving(true);
    setSaveStatus(null);

    try {
      await saveMessageWithImage({
        userEmail: auth.currentUser.uid,
        message: letter.text,
      });

      setSaveStatus("success");
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    
    <LetterView
      {...letter}
      onSave={handleSave}
      isSaving={isSaving}
      saveStatus={saveStatus}
    />
  );
}