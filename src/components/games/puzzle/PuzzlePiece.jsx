function PuzzlePiece({
  piece,
  pieceSize,
  imageUrl,
  cols,
  canSnap,
  onPointerDown,
}) {
  const isFree = piece.isDragging || piece.isPlaced;

  return (
    <div
      onPointerDown={onPointerDown}
      className={`
        rounded-md border-2 touch-none
        ${piece.isPlaced ? "cursor-default" : "cursor-grab"}
        ${
          canSnap && piece.isDragging
            ? "border-green-400 shadow-[0_0_12px_rgba(74,222,128,0.7)]"
            : "border-pink-400"
        }
      `}
      style={{
        width: pieceSize,
        height: pieceSize,
        position: isFree ? "absolute" : "relative",
        left: isFree ? piece.x : undefined,
        top: isFree ? piece.y : undefined,
        zIndex: piece.isDragging ? 50 : 10,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${cols * pieceSize}px`,
        backgroundPosition: `-${piece.correctX}px -${piece.correctY}px`,
        transition: piece.isDragging ? "none" : "transform 0.2s ease",
      }}
    />
  );
}

export default PuzzlePiece;
