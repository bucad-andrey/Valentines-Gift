import React from "react";
import LoveCard from "./LoveCard";

// FUNCTIONALITY: render all love cards
export default function LoveCardsGrid({
  cards,
  onImageChange,
  onMessageChange,
}) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

      {cards.map((card, index) => (
        <LoveCard
          key={index}
          index={index}
          mode="edit"
          imageUrl={card.imageUrl}
          messageText={card.message}
          onImageFileChange={onImageChange}
          onMessageChange={onMessageChange}
        />
      ))}

    </div>
  );
}