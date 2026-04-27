import React from 'react'
import { motion } from "framer-motion";

function LetterDecor({styling}) {

  // FUNCTIONALITY: image config with fixed positions
  const letterImages = {
    left: [
      { src: "/letterFW.png"},
      { src: "/letterLFW.png"},
      { src: "/letterSTB.png"},
    ],
    right: [
      { src: "/letterHeart.png"},
      { src: "/letterRFW.png"},
      { src: "/letterStar.png"},
    ],
    bottom: [
      { src: "/letterCC.png"},
    ],
  };
      
  const leftVariant = { 
    hidden: { 
      x: -100, 
      opacity: 0 }, 

    visible: (index) => ({ 
      x: 0, 
      opacity: 1, 
      transition: { delay: index * 0.2, duration: 1, }, 
    }), 
  }; 

  const rightVariant = { 
    hidden: { x: 100, 
      opacity: 0 }, 

    visible: (index) => ({ 
      x: 0, 
      opacity: 1, 
      transition: { delay: index * 0.2, duration: 1, }, 
    }), 
  }; 

  const bottomVariant = { 
    hidden: { 
      y: 100, 
      opacity: 0 },

    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 1, }, }, 
  };
  
  return (
    <div className={styling}>

          {/* LEFT */}
          {letterImages.left.map((item, index) => (
          <motion.img
            key={`left-${index}`}
            src={item.src}
            className={`absolute w-[400px] h-auto object-contain 
                        block lg:w-[700px] lg:h-[650px]`}

            variants={leftVariant}
            initial="hidden"
            animate="visible"
            custom={index}
          />
          ))}

          {/* RIGHT */}
          {letterImages.right.map((item, index) => (
          <motion.img
            key={`right-${index}`}
            src={item.src}
            className={`absolute w-[400px] h-auto object-contain 
                        block lg:w-[700px] lg:h-[650px]`}

            variants={rightVariant}
            initial="hidden"
            animate="visible"
            custom={index}
          />
          ))}

          {/* BOTTOM */}
          {letterImages.bottom.map((item, index) => (
          <motion.img
            key={`bottom-${index}`}
            src={item.src}
            className={`absolute w-[400px] h-auto object-contain 
                        block lg:w-[700px] lg:h-[650px] md:hidden`}

            variants={bottomVariant}
            initial="hidden"
            animate="visible"
          />
          ))}

    </div>
  )
}

export default LetterDecor