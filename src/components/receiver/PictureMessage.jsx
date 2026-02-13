import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoveCard from "../ui/LoveCard";
import { auth } from "../utils/firestore";
import { fetchLoveCards } from "../utils/firestoreHelpers";

function PictureMessage() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickedMap, setClickedMap] = useState({});

  useEffect(() => {
    const loadCards = async () => {
      if (!auth.currentUser?.email) {
        setError("No user logged in");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchLoveCards(auth.currentUser.email);

        // Sort by card index if ids follow "card-{index}" pattern
        const sorted = [...data].sort((a, b) => {
          const matchA = a.id.match(/^card-(\d+)$/);
          const matchB = b.id.match(/^card-(\d+)$/);
          const indexA = matchA ? parseInt(matchA[1], 10) : 0;
          const indexB = matchB ? parseInt(matchB[1], 10) : 0;
          return indexA - indexB;
        });

        setCards(sorted);
      } catch (err) {
        console.error("Error fetching love cards:", err);
        setError(err.message || "Failed to load memories");
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  const handleCardFlip = (index) => {
    setClickedMap((prev) => {
      if (prev[index]) return prev;
      return { ...prev, [index]: true };
    });
  };

  const allClicked =
    cards.length > 0 && cards.every((_, index) => clickedMap[index]);

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-primary-soft to-secondary-soft py-2 px-6 flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Loading memories...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-br from-primary-soft to-secondary-soft py-2 px-6 flex justify-center items-center min-h-screen">
        <div className="text-error text-xl">Error: {error}</div>
      </section>
    );
  }

  if (cards.length === 0) {
    return (
      <section className="bg-gradient-to-br from-primary-soft to-secondary-soft py-2 px-6 flex justify-center items-center min-h-screen">
        <div className="text-primary-text text-lg">
          No picture memories have been created yet.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-primary-soft to-secondary-soft p-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-primary-text mb-6">
          Our picture memories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <LoveCard
              key={card.id || index}
              index={index}
              mode="view"
              imageUrl={card.image}
              messageText={card.value}
              onFlip={handleCardFlip}
            />
          ))}
        </div>

        {allClicked && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/game2")}
              className="px-8 py-4 rounded-xl bg-primary text-white hover:bg-primary-hover transition font-semibold text-lg shadow-lg"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default PictureMessage;