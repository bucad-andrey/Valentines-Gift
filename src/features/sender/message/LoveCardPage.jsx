import React from "react";

import LoveGuide from "./LoveGuide";
import LovePageHeader from "./LovePageHeader";
import LovePageStatus from "./LovePageStatus";
import LoveCardsGrid from "./LoveCardsGrid";

import { useLoveCards } from "./useLoveCards";
import GuideOverlayed from "../../../shared/guide/GuideOverlayed";
import { LETTER_GUIDE } from "../../../shared/constant/useGuideText";

// FUNCTIONALITY: composition layer for love page
function LovePage() {

  const {
    cards,
    isSaving,
    saveStatus,
    updateImage,
    updateMessage,
    saveAllCards,
  } = useLoveCards(6);

  return (
    <section className="px-2 min-h-screen">
      <GuideOverlayed 
        guideText={LETTER_GUIDE}
      />

      <div className="max-w-5xl mx-auto space-y-6">

        <LovePageHeader
          onSave={saveAllCards}
          isSaving={isSaving}
        />

        <LovePageStatus
          saveStatus={saveStatus}
        />

        <LoveCardsGrid
          cards={cards}
          onImageChange={updateImage}
          onMessageChange={updateMessage}
        />

      </div>
    </section>
  );
}

export default LovePage;