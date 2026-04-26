import { useState } from "react";
import { validateInvite } from "./inviteValidation.utils";
import { saveFinalMessage } from "../../utils/firestoreHelpers";
import { auth } from "../../utils/firestore";

export function useInviteForm(initialState) {
  const [form, setForm] = useState(initialState);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  /* =========================
     FUNCTIONALITY: update form field
  ========================== */
  const updateField = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      console.log("[DEBUG] updateField:", field, value);
      return next;
    });
  };

  /* =========================
     FUNCTIONALITY: submit form
  ========================== */
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
      const result = await saveFinalMessage({
        userEmail: auth.currentUser.uid,
        ...form,
      });

      console.log("[DEBUG] saved:", result);

      setStatus("success");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    updateField,
    submit,
    isSaving,
    error,
    status,
    setForm, // needed for bootstrap
  };
}