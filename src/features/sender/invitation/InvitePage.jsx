import { useNavigate } from "react-router-dom";
import { useInviteBootstrap } from "./useInviteBootstrap.hook";
import InviteForm from "./InviteForm.components";
import { useInviteForm } from "./useInviteForm.hooks";

const initialState = {
  invitationType: "",
  customType: "",
  when: "",
  whereImageFiles: [null, null, null],
  whereImagePreviews: [null, null, null],
  whereImageUrls: [null, null, null],
  selectedWhereIndex: null,
  dressCode: "",
  soundtrackUrl: "",
  message: "",
};

export default function InvitePage() {
  const navigate = useNavigate();

  const {
    form,
    updateField,
    submit,
    isSaving,
    error,
    status,
    setForm,
  } = useInviteForm(initialState);

  useInviteBootstrap(setForm);

  return (
    <section>
      <InviteForm form={form} updateField={updateField} />

      {error && <p>{error}</p>}
      {status === "success" && <p>Saved</p>}

      <button onClick={submit} disabled={isSaving}>
        Save
      </button>

      <button onClick={() => navigate("/finalMessage")}>Preview</button>
    </section>
  );
}

