import { forwardRef } from "react";

const PuzzleBoard = forwardRef(function PuzzleBoard(
  { cols, rows, pieceSize, pieces, imageUrl, showHint },
  ref
) {
  return (
    <div
      ref={ref}
      className="border-4 border-pink-400 rounded-lg overflow-hidden relative left-5"
      style={{
        width: cols * pieceSize,
        height: rows * pieceSize,
      }}
    >
      {/* Visual Hint */}
      {showHint && (
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${cols * pieceSize}px`,
            backgroundPosition: "top left",
          }}
        />
      )}

      {/* Grid */}
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute border border-dashed border-pink-300"
          style={{
            width: pieceSize,
            height: pieceSize,
            left: piece.correctX,
            top: piece.correctY,
          }}
        />
      ))}
    </div>
  );
});

export default PuzzleBoard;
