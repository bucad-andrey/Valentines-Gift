import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Letter() {

  /*
  FUNCTIONALITY:
  Store text input from textarea
  */
  const [text, setText] = useState("");

  useEffect(()=> {
    const letter = localStorage.getItem("letterSent");
    console.info(letter)
    if(letter) setText(letter);  
  },[])

  const handleMessageChange = (e) => {
    setText(e.target.value);
    localStorage.setItem("letterSent", e.target.value);
  };

  /*
  FUNCTIONALITY:
  Array of overlay images
  */
  const letterImages = [
    "/letterCC.png", 
    "/letterFW.png",
    "/LetterHeart.png",
    "/letterLFW.png",
    "/letterRFW.png",
    "/letterStar.png",
    "/letterSTB.png",
  ];

  console.log("📄 Letter component rendered");

  /*
  FUNCTIONALITY:
  Animation config (reusable)
  */
  const animationVariant = {
    hidden: {
      x: -100,       // start from left
      opacity: 0,    // invisible
    },
    visible: (index) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: index * 0.2, // stagger effect
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="w-full h-screen flex justify-center items-center relative">

      {/*
      FUNCTIONALITY:
      Background image
      */}
      <img
        src="/letterBG.svg"
        alt="Letter Background"
        className="h-screen object-contain z-0"
        
      />

      {/*
      FUNCTIONALITY:
      Centered textarea on top of the letter
      */}
      <textarea
        value={text}
        onChange={handleMessageChange}
        placeholder="Write your message here..."
        className="
          absolute
          z-20
          lg:h-150
          lg:w-100
          h-120
          w-80
          p-4
          rounded-xl
          text-black
          border
          resize-none
          outline-none
          
          lg:top-1/2 lg:left-1/2
          lg:-translate-x-1/2 lg:-translate-y-1/2
        "
      />

      {/*
      FUNCTIONALITY:
      Animated overlay images
      */}
      {letterImages.map((image, index) => {

        console.log("🎨 Rendering animated image:", image);

        return (
          <motion.img
            key={index}
            src={image}
            alt={`overlay-${index}`}
            custom={index}
            variants={animationVariant}
            initial="hidden"
            animate="visible"
            className="
              absolute
              top-0
              h-screen
              object-contain
              z-10
              pointer-events-none
            "
          />
        );
      })}

    </div>
  );
}

export default Letter;