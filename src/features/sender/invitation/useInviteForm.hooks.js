import { useState } from "react";
import { validateInvite } from "./inviteValidation.utils";
import { saveFinalMessage } from "../../../shared/lib/firestore/firestoreHelpers";
import { auth } from "../../../shared/lib/firebase/client";

export function useInviteForm(initialState) {
  const [form, setForm] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    const validationError = validateInvite(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError("");
    setStatus(null);

    try {
      await saveFinalMessage({
        userEmail: auth.currentUser.uid,
        ...form,
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return { form, updateField, submit, isSaving, error, status, setForm };
}

