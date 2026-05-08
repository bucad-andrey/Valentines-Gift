import React from 'react';
import { motion } from "framer-motion";
import '../romantic.css';

function Content() {
  return (
    <div className="relative z-10 text-center px-6">

      {/* SMALL LABEL (adds hierarchy) */}
      <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.7, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-sm tracking-widest uppercase text-gray-700"
      >
      Welcome
      </motion.p>

      {/* MAIN TITLE */}
      <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-4xl md:text-5xl font-bold 
      font-[Patrick_Hand] text-gray-900 leading-tight">
      Hello, Romantic One
      </motion.h1>

    {/* ACCENT LINE (important visual polish) */}
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.6 }}
      className="h-1 w-98 mx-auto mt-4 
      bg-gradient-to-r from-pink-400 to-rose-400 
      rounded-full origin-left"/>

      {/* SUBTEXT (emotional tone) */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{ delay: 0.8 }}
      className="mt-6 text-gray-700 text-base max-w-sm mx-auto">
      A little place for your sweetest moments 💕
    </motion.p>
  </div>
  )
}

export default Content