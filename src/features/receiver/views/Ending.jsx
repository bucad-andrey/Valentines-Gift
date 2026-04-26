import React, { useEffect, useRef, useState } from "react";

export function Ending() {
  const fullText = "Thank you so much, see you later! 😘";

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    let currentIndex = 0;
    setIsTyping(true);

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
      }
    }, 30);

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-primary-soft to-secondary-soft py-2 px-6 flex justify-center items-center min-h-screen">
      <div
        className="w-full md:w-200 md:text-7xl min-h-50 text-2xl md:min-h-150 p-6 rounded-2xl 
      bg-surface-main border border-secondary-soft text-primary-text
      text-center flex justify-center items-center
      "
      >
        <p className="whitespace-pre-wrap">
          {displayedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </p>
      </div>
    </section>
  );
}

