import { useEffect, useState } from "react";
import { auth } from "../../../config/firestore";
import {
  fetchLoveCards,
  saveLoveCard,
} from "../../../config/firestoreHelpers";

// FUNCTIONALITY: central business logic for love cards
export function useLoveCards(cardCount = 6) {

  const [cards, setCards] = useState(
    Array.from({ length: cardCount }).map(() => ({
      message: "",
      imageFile: null,
      imageUrl: null,
    }))
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // FUNCTIONALITY: load saved cards
  useEffect(() => {
    async function loadCards() {
      if (!auth.currentUser?.uid) return;

      try {
        const existing = await fetchLoveCards(auth.currentUser.uid);

        setCards((prev) => {
          const next = [...prev];

          existing.forEach((card) => {
            const match = card.id.match(/^card-(\d+)$/);
            const index = match ? parseInt(match[1], 10) : null;

            if (index !== null && next[index]) {
              next[index] = {
                ...next[index],
                message: card.value || "",
                imageUrl: card.image || null,
              };
            }
          });

          return next;
        });

      } catch (err) {
        console.error("Failed loading love cards:", err);
      }
    }

    loadCards();
  }, [cardCount]);

  // FUNCTIONALITY: update image
  function updateImage(index, file) {
    setCards((prev) => {
      const next = [...prev];

      next[index] = {
        ...next[index],
        imageFile: file,
      };

      return next;
    });
  }

  // FUNCTIONALITY: update message
  function updateMessage(index, message) {
    setCards((prev) => {
      const next = [...prev];

      next[index] = {
        ...next[index],
        message,
      };

      return next;
    });
  }

  // FUNCTIONALITY: save all cards
  async function saveAllCards() {
    if (!auth.currentUser?.uid) return;

    setIsSaving(true);
    setSaveStatus(null);

    try {

      await Promise.all(
        cards.map((card, index) => {

          const hasContent =
            card.message?.trim() ||
            card.imageFile ||
            card.imageUrl;

          if (!hasContent) {
            return Promise.resolve();
          }

          return saveLoveCard({
            userEmail: auth.currentUser.uid,
            cardId: `card-${index}`,
            message: card.message || "",
            imageFile: card.imageFile,
          });

        })
      );

      setSaveStatus("success");

    } catch (err) {
      console.error("Failed saving cards:", err);
      setSaveStatus("error");

    } finally {
      setIsSaving(false);
    }
  }

  return {
    cards,
    isSaving,
    saveStatus,
    updateImage,
    updateMessage,
    saveAllCards,
  };
}