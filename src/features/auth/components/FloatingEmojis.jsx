import React, { useMemo } from "react";
import { motion } from "framer-motion";

// FUNCTIONALITY: generate stable animation data
function generateEmojis(count) {
  return Array.from({ length: count }).map(() => ({
    id: Math.random(),
    top: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 8 + Math.random() * 4,
    size: 18 + Math.random() * 16,
    drift: Math.random() * 40 - 20, // vertical movement
  }));
}

export default function FloatingEmojis({ count = 8 }) {
  const emojis = useMemo(() => generateEmojis(count), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {emojis.map((emoji) => (
        <motion.div
          key={emoji.id}

          // FUNCTIONALITY: start off-screen right
          initial={{ x: "100vw", opacity: 0 }}

          // FUNCTIONALITY: smooth left flow + subtle vertical drift
          animate={{
            x: "-120vw",
            y: [0, emoji.drift, 0],
            opacity: [0, 0.6, 0.6, 0],
          }}

          // FUNCTIONALITY: continuous loop
          transition={{
            duration: emoji.duration,
            delay: emoji.delay,
            repeat: Infinity,
            ease: "linear",
          }}

          style={{
            position: "absolute",
            top: `${emoji.top}%`,
            fontSize: `${emoji.size}px`,
          }}
        >
          🥰
        </motion.div>
      ))}
    </div>
  );
}