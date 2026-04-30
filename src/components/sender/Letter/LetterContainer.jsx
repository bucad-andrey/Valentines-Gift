import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firestore";
import { doc, getDoc } from "firebase/firestore";
import { saveMessageWithImage } from "../../utils/firestoreHelpers";
import { useLetter } from "./useLetter";
import LetterView from "./LetterView";
import { fetchMessage } from "../../utils/firestoreHelpers";

export default function LetterContainer() {
  const letter = useLetter("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // FUNCTIONALITY: load initial data
  useEffect(() => {
    const loadMessage = async () => {
      const userId = auth?.currentUser?.uid || null;
  
      const msg = await fetchMessage(userId);
  
      letter.setText(msg);
    };
  
    loadMessage();
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