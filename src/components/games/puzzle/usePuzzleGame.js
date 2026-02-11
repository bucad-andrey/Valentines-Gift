import { useEffect, useState } from "react";

export function usePuzzleGame({
  cols,
  rows,
  pieceSize,
  snapDistance,
  maxMistakes,
}) {
  const [showHint, setShowHint] = useState(true);
  const [activePieceId, setActivePieceId] = useState(null);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [mistakes, setMistakes] = useState(0);
  const [showResetMessage, setShowResetMessage] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [pieces, setPieces] = useState(() => {
    const temp = [];
    let id = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        temp.push({
          id,
          correctX: col * pieceSize,
          correctY: row * pieceSize,
          homeX: 0,
          homeY: 0,
          x: 0,
          y: 0,
          isPlaced: false,
          isDragging: false,
        });
        
        id++;
      }
    }

    return temp;
  });

  // ===== GAME RULES =====
  useEffect(() => {
    if (pieces.every((p) => p.isPlaced)) {
      setIsCompleted(true);
    }
  }, [pieces]);

  function canSnap(piece) {
    const dx = piece.x - piece.correctX;
    const dy = piece.y - piece.correctY;
    return Math.sqrt(dx * dx + dy * dy) < snapDistance;
  }

  function resetGame() {
    setPieces((prev) =>
      prev.map((p, index) => ({
        ...p,
        x: 20 + index * (pieceSize + 10),
        y: rows * pieceSize + 60,
        isPlaced: false,
      }))
    );
    setMistakes(0);
    setShowResetMessage(false);
    setIsCompleted(false);
  }

  // ===== INTERACTIONS =====
  function grabPiece(e, id) {
    const piece = pieces.find((p) => p.id === id);
    if (!piece || piece.isPlaced || isCompleted) return;

    // Calculate the piece's position relative to its offset parent so that
    // switching to absolute positioning does not cause it to "jump" to 0,0.
    const pieceRect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.offsetParent.getBoundingClientRect();
    const startX = pieceRect.left - parentRect.left;
    const startY = pieceRect.top - parentRect.top;

    setPieces((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isDragging: true,
              // Store the home position where the piece started this drag
              homeX: startX,
              homeY: startY,
              // Set initial absolute position to match the visual position
              x: startX,
              y: startY,
            }
          : p
      )
    );

    setActivePieceId(id);
    setPointerOffset({
      // Pointer offset within the piece box
      x: e.clientX - pieceRect.left,
      y: e.clientY - pieceRect.top,
    });

    e.currentTarget.setPointerCapture(e.pointerId);
  }


  function movePiece(e) {
    if (activePieceId === null || isCompleted) return;

    // We position pieces relative to their offset parent (the puzzle area),
    // so we need to convert the global pointer coordinates into that space.
    const parentRect = e.currentTarget.getBoundingClientRect();

    setPieces((prev) =>
      prev.map((p) =>
        p.id === activePieceId
          ? {
              ...p,
              x: e.clientX - parentRect.left - pointerOffset.x,
              y: e.clientY - parentRect.top - pointerOffset.y,
            }
          : p
      )
    );
  }

  function releasePiece() {
    if (activePieceId === null || isCompleted) return;

    let snapped = false;

    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== activePieceId) return p;

        if (canSnap(p)) {
          snapped = true;
          setShowHint(false); // 👈 auto-hide hint
          return {
            ...p,
            x: p.correctX,
            y: p.correctY,
            isPlaced: true,
            isDragging: false,
          };
        }

        // ❗ Snap back to tray
        return {
          ...p,
          x: p.homeX,
          y: p.homeY,
          isDragging: false,
        };
      })
    );

    if (!snapped) {
      setMistakes((m) => m + 1);
    }

    setActivePieceId(null);
  }

  return {
    pieces,
    mistakes,
    isCompleted,
    showResetMessage,
    showHint,
    setShowHint,
    grabPiece,
    movePiece,
    releasePiece,
    canSnap,
  };
}