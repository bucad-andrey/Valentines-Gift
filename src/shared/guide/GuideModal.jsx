import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// FUNCTIONALITY: reusable modal overlay for guides
export default function GuideModal({
  isOpen,
  onClose,
  children,
}) {

  // FUNCTIONALITY: close on ESC key
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* FUNCTIONALITY: backdrop */}
          <motion.div
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* FUNCTIONALITY: modal content */}
          <motion.div
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              pointer-events-none
            "
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              // FUNCTIONALITY: prevent closing when clicking inside content
              onClick={(e) => e.stopPropagation()}
              className="
                pointer-events-auto
                bg-white rounded-xl shadow-xl
                p-6 max-w-md w-[90%]
                text-center
              "
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}