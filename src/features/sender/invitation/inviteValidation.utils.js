export function validateInvite(form) {
  const {
    invitationType,
    customType,
    when,
    selectedWhereIndex,
    whereImageFiles,
    whereImageUrls,
    message,
  } = form;

  const finalType = invitationType === "custom" ? customType.trim() : invitationType;

  if (!finalType) return "Choose invitation type";
  if (!when) return "Pick date & time";
  if (selectedWhereIndex === null) return "Select location";

  const hasImage =
    whereImageFiles[selectedWhereIndex] || whereImageUrls[selectedWhereIndex];

  if (!hasImage) return "Upload location image";
  if (!message.trim()) return "Write a message";

  return null;
}

