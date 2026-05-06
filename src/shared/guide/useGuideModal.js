import { useState, useCallback } from "react";

// FUNCTIONALITY: reusable modal state manager
export function useGuideModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openGuide = useCallback(() => setIsOpen(true), []);
  const closeGuide = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    openGuide,
    closeGuide,
  };
}