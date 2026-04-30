import React, { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firestore";
import { useNavigate } from "react-router-dom";


function PreviewLetter({userId}) {
  const [text, setText] = useState("");
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [animatedText, setAnimatedText] = useState("");
  const [hasSkipped, setHasSkipped] = useState(false);
  const typingIntervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const docRef = doc(
      db,
      "Senders",
      userId,
      "message1",
      "message"
    );

    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setText(data?.value || "");
        } else {
          setText("");
        }
      },
      (error) => {
        console.error("Failed to subscribe to message:", error);
      }
    );

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const maxCharsPerPage = 500;
    const split = [];

    for (let i = 0; i < text.length; i += maxCharsPerPage) {
      split.push(text.slice(i, i + maxCharsPerPage));
    }

    setPages(split);
    setCurrentPage(0);
  }, [text]);

  useEffect(() => {
    let index = 0;
    const currentText = pages[currentPage] || "";

    setAnimatedText("");
    setHasSkipped(false);

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      index++;
      setAnimatedText(currentText.slice(0, index));

      if (index >= currentText.length) {
        clearInterval(typingIntervalRef.current);
      }
    }, 60);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [currentPage, pages]);

  const handleSkip = () => {
    if (hasSkipped) return;
    const currentText = pages[currentPage] || "";

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    setAnimatedText(currentText);
    setHasSkipped(true);
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      navigate("../game2");
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <section
      className="
      bg-linear-to-br from-primary-soft to-secondary-soft
      w-full min-h-screen
      md:flex flex-col
      items-center"
    >
      <div className="block lg:flex justify-center items-center relative">  
        <img
          src="/letterBG.svg"
          alt="Letter Background"
          className="
          w-[400px] h-auto object-contain 
          block
          
          lg:w-[700px] lg:h-[650px]
          "
        />

        {/* Page indicator (top-right of letter area) */}
        {pages.length > 0 && (
          <div
            className="absolute top-6 right-8 text-sm text-gray-700 bg-white/70 px-3 py-1 rounded-full shadow"
          >
            {currentPage + 1}/{pages.length}
          </div>
        )}

        <div
          className="
              absolute top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              h-[500px] w-screen md:w-[400px]
              p-16 mg:p-8 pt-16 md:pt-3

              font-[Patrick_Hand]
              text-lg
              leading-6 mg:leading-8
              tracking-wide 
              text-black

              whitespace-pre-wrap
            "
        >
          {animatedText}
        </div>
      </div>

      <div
        className="
      flex gap-4 mt-10 
      overflow-scroll relative
      
      md:absolute md:bottom-1
      md:overflow-hidden"
      >
        <button
          onClick={handleSkip}
          disabled={hasSkipped || pages.length === 0}
          className="px-3 py-2 bg-gray-300 rounded disabled:hidden"
        >
          Skip
        </button>

        {hasSkipped && (
          <>
            <button
              onClick={prevPage}
              className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
              disabled={currentPage === 0}
            >
              Prev
            </button>
            <button
              onClick={nextPage}
              className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default PreviewLetter;