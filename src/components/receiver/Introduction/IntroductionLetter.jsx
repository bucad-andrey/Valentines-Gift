import React, { useEffect, useState } from 'react'
import LetterView from '../../sender/Letter/LetterView';
import { useLetter } from '../../sender/Letter/useLetter';
import { fetchMessage } from '../../utils/firestoreHelpers';



function IntroductionLetter({senderID}) {
  const letterMessage = useLetter("");
  const [isSaving, setSaving] = useState(false);
  const [saveStatus, setSavingStatus] = useState(null)
  

  useEffect(() => {
    const loadMessage = async () => {
      const userId = auth?.currentUser?.uid || null;
  
      const msg = await fetchMessage(userId);
  
      letterMessage.setText(msg);
    };
  
    loadMessage();
  }, []);


    // FUNCTIONALITY: persist locally
    useEffect(() => {
      localStorage.setItem("letterSent", letterMessage.text);
    }, [letterMessage.text]);
  
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
    {...letterMessage}
    onSave={handleSave}
    isSaving={isSaving}
    saveStatus={saveStatus}
    />
  )
}

export default IntroductionLetter