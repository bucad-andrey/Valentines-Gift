import React from "react";
import WhereSelector from "./WhereSelector.components";

function InviteForm({ form, updateField }) {
  return (
    <>
      <input
        value={form.when}
        onChange={(e) => updateField("when", e.target.value)}
      />

      <WhereSelector form={form} updateField={updateField} />

      <textarea
        value={form.message}
        onChange={(e) => updateField("message", e.target.value)}
      />
    </>
  );
}

export default InviteForm;