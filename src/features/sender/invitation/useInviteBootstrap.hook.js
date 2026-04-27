import { useEffect } from "react";
import { fetchLatestFinalMessage } from "../../../shared/lib/firestore/firestoreHelpers";
import { auth } from "../../../shared/lib/firebase/client";

function loadInviteDraft() {
  try {
    const raw = localStorage.getItem("inviteDraft");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveInviteDraft(data) {
  try {
    localStorage.setItem("inviteDraft", JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useInviteBootstrap(setForm) {
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const userId = auth.currentUser?.uid;
      const firestoreData = userId ? await fetchLatestFinalMessage(userId) : null;
      if (cancelled) return;

      if (firestoreData) {
        setForm((prev) => ({ ...prev, ...firestoreData }));
        saveInviteDraft(firestoreData);
      } else {
        const draft = loadInviteDraft();
        if (draft) setForm((prev) => ({ ...prev, ...draft }));
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [setForm]);
}

