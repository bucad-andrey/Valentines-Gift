import React, { useEffect, useState } from "react";
import LoveCard from "../ui/LoveCard";
import { auth } from "../utils/firestore";
import { fetchLoveCards, saveLoveCard } from "../utils/firestoreHelpers";

function LovePage() {
  // You should be able to scroll on this page, even with many cards.
  const CARD_COUNT = 6; // adjust as needed

  const [cards, setCards] = useState(
    () =>
      Array.from({ length: CARD_COUNT }).map(() => ({
        message: "",
        imageFile: null,
        imageUrl: null,
      }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Load any existing cards for this user
  useEffect(() => {
    const loadExistingCards = async () => {
      if (!auth.currentUser?.email) return;

      try {
        const existing = await fetchLoveCards(auth.currentUser.email);

        setCards((prev) => {
          const next = [...prev];

          existing.forEach((card) => {
            const match = card.id.match(/^card-(\d+)$/);
            const index = match ? parseInt(match[1], 10) : null;

            if (index !== null && index >= 0 && index < next.length) {
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
        console.error("Failed to load LovePage cards:", err);
      }
    };

    loadExistingCards();
  }, [CARD_COUNT]);

  const handleImageChange = (index, file) => {
    setCards((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        imageFile: file,
      };
      return next;
    });
  };

  const handleMessageChange = (index, text) => {
    setCards((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        message: text,
      };
      return next;
    });
  };

  const handleSaveAll = async () => {
    if (!auth.currentUser?.email) return;

    setIsSaving(true);
    setSaveStatus(null);

    try {
      await Promise.all(
        cards.map((card, index) => {
          const hasContent =
            (card.message && card.message.trim().length > 0) ||
            card.imageFile ||
            card.imageUrl;

          if (!hasContent) {
            return Promise.resolve();
          }

          return saveLoveCard({
            userEmail: auth.currentUser.email,
            cardId: `card-${index}`,
            message: card.message || "",
            imageFile: card.imageFile,
          });
        })
      );

      setSaveStatus("success");
    } catch (err) {
      console.error("Failed to save LovePage cards:", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-soft to-secondary-soft p-6 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-primary-text">
            Your picture memories
          </h2>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-6 py-3 rounded-xl font-semibold transition
              ${
                isSaving
                  ? "bg-disabled text-error cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-hover"
              }`}
          >
            {isSaving ? "Saving..." : "Save all cards"}
          </button>
        </div>

        {saveStatus === "success" && (
          <p className="text-success font-medium">
            All cards have been saved.
          </p>
        )}

        {saveStatus === "error" && (
          <p className="text-error font-medium">
            Failed to save cards. Please try again.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <LoveCard
              key={index}
              index={index}
              mode="edit"
              imageUrl={card.imageUrl}
              messageText={card.message}
              onImageFileChange={handleImageChange}
              onMessageChange={handleMessageChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default LovePage;
