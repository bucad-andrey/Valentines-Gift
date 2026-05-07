import React from "react";
import { motion } from "framer-motion";

// FUNCTIONALITY: reusable help trigger button
export default function GuideTrigger({
  onClick,
  className = "",
}) {
  return (
    <motion.button
      onClick={onClick}

      // FUNCTIONALITY: subtle hover/tap animation
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}

      className={`
        w-10 h-10
        rounded-full
        bg-white/90
        shadow-lg
        border border-gray-200

        flex items-center justify-center

        text-xl font-bold text-white

        backdrop-blur-sm

        ${className}
      `}
    >
      ?
    </motion.button>
  );
}