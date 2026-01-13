import React from "react";
import LoveCard from "../ui/LoveCard";

function LovePage() {
//FIX THE SCROLLING PROBLEM YOU SHOULD BE ABLE TO SCROLL DOWN ESPECIALLIY IN THIS PAGE ✅
//ADD SELECTION FOR THE CARD COUNT : 3 - 8 SCROLL TYPE
  
  const CARD_COUNT = 4; // change to 6 anytime

  return (
    <section className="bg-gradient-to-br from-primary-soft to-secondary-soft p-6">
      <inpit type="radio" className="w-10 h-fit bg-black text-white"></inpit>
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
        {Array.from({ length: CARD_COUNT }).map((_, index) => (
          <LoveCard key={index} index={index} />
        ))}
      </div>
    </section>
  );
}

export default LovePage;
