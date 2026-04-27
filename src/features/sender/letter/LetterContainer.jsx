import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../../../shared/lib/firebase/client";
import { saveMessageWithImage } from "../../../shared/lib/firestore/firestoreHelpers";

import { useLetter } from "./useLetter";
import LetterView from "./LetterView";

async function fetchMessage() {
  if (!auth.currentUser) return localStorage.getItem("letterSent") || "";

  try {
    const ref = doc(db, "Senders", auth.currentUser.uid, "message1", "message");
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

  useEffect(() => {
    fetchMessage().then((msg) => {
      letter.setText(msg);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("letterSent", letter.text);
  }, [letter.text]);

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

