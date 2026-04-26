import { useEffect } from "react";
import { fetchLatestFinalMessage } from "../../utils/firestoreHelpers";
import { loadInviteDraft, saveInviteDraft } from "../../hooks/saveToLocalStorage";
import { auth } from "../../utils/firestore";

export function useInviteBootstrap(setForm) {
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const userId = auth.currentUser?.uid;

      const firestoreData = userId
        ? await fetchLatestFinalMessage(userId)
        : null;

      if (cancelled) return;

      if (firestoreData) {
        console.log("[DEBUG] Firestore bootstrap");

        setForm((prev) => ({
          ...prev,
          ...firestoreData,
        }));

        saveInviteDraft(firestoreData);
      } else {
        const draft = loadInviteDraft();
        if (draft) {
          console.log("[DEBUG] Local draft bootstrap");
          setForm((prev) => ({ ...prev, ...draft }));
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [setForm]);
}