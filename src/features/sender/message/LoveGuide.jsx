import React from "react";
import GuideTrigger from "../../../shared/guide/GuideTrigger";
import GuideModal from "../../../shared/guide/GuideModal";
import { useGuideModal } from "../../../shared/guide/useGuideModal";
import { LETTER_GUIDE } from "../../../shared/constant/useGuideText";

// FUNCTIONALITY: reusable page guide system
export default function LoveGuide() {

  const {
    isOpen,
    openGuide,
    closeGuide,
  } = useGuideModal();

  return (
    <>
      <GuideTrigger
        onClick={openGuide}
        className="fixed bottom-4 right-4"
      />

      <GuideModal
        isOpen={isOpen}
        onClose={closeGuide}
      >
        <p className="text-green-500">
          {LETTER_GUIDE}
        </p>
      </GuideModal>
    </>
  );
}