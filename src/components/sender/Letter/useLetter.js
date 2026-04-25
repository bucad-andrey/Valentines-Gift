import { useEffect, useState } from "react";
import { splitText } from "./letter.utils";

// FUNCTIONALITY: manage letter state and pagination
export function useLetter(initialText = "") {
  const [text, setText] = useState(initialText);
  const [pages, setPages] = useState([""]);
  const [currentPage, setCurrentPage] = useState(0);

  // FUNCTIONALITY: recompute pages when text changes
  useEffect(() => {
    const newPages = splitText(text, 500);
    setPages(newPages);

    setCurrentPage((prev) =>
      prev >= newPages.length ? newPages.length - 1 : prev
    );
  }, [text]);

  // FUNCTIONALITY: update current page text
  const updatePage = (value) => {
    const max = 500;

    const before = text.slice(0, currentPage * max);
    const after = text.slice((currentPage + 1) * max);

    setText(before + value + after);
  };

  // FUNCTIONALITY: navigation
  const nextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, pages.length - 1));

  const prevPage = () =>
    setCurrentPage((p) => Math.max(p - 1, 0));

  return {
    text,
    setText,
    pages,
    currentPage,
    updatePage,
    nextPage,
    prevPage,
  };
}