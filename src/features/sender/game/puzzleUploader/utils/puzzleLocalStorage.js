/*
  FUNCTIONALITY:
  LocalStorage utilities for puzzle uploader persistence.

  Responsibilities:
  - Save local draft
  - Restore local draft
  - Clear local draft
*/

const STORAGE_KEY = "puzzleUploaderDraft";

/*
  FUNCTIONALITY:
  Save draft into localStorage.

  @param {Object} payload
*/
export const savePuzzleDraft = (payload) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    console.group("[PuzzleLocalStorage]");
    console.log("Draft saved");
    console.log(payload);
    console.groupEnd();

  } catch (error) {
    console.error("[PuzzleLocalStorage] save error:", error);
  }
};

/*
  FUNCTIONALITY:
  Restore draft from localStorage.
*/
export const getPuzzleDraft = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    console.group("[PuzzleLocalStorage]");
    console.log("Draft restored");
    console.log(parsed);
    console.groupEnd();

    return parsed;

  } catch (error) {
    console.error("[PuzzleLocalStorage] restore error:", error);
    return null;
  }
};

/*
  FUNCTIONALITY:
  Remove local draft.
*/
export const clearPuzzleDraft = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);

    console.group("[PuzzleLocalStorage]");
    console.log("Draft cleared");
    console.groupEnd();

  } catch (error) {
    console.error("[PuzzleLocalStorage] clear error:", error);
  }
};