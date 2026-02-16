import { useNavigate } from "react-router-dom";
import PuzzleBoard from "./PuzzleBoard";
import PuzzlePiece from "./PuzzlePiece";
import { usePuzzleGame } from "./usePuzzleGame";
import PuzzleTray from "./PuzzleTray";
import { PUZZLE_CONFIG } from './puzzleConfig'

function Puzzle({ onComplete }) {
  const navigate = useNavigate();

  const game = usePuzzleGame(PUZZLE_CONFIG);

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
      return;
    }

    navigate("/pictureMessage");
  };

  return (
    <div
      className="relative w-full min-h-screen bg-pink-50 flex items-center justify-center py-16"
    >
      <div
        className="relative"
        style={{
          width: PUZZLE_CONFIG.cols * PUZZLE_CONFIG.pieceSize + 40,
          height: PUZZLE_CONFIG.rows * PUZZLE_CONFIG.pieceSize + 220,
        }}
        onPointerMove={game.movePiece}
        onPointerUp={game.releasePiece}
        onPointerCancel={game.releasePiece}
      >
        {!game.isCompleted && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-pink-600 font-semibold">
            Mistakes: {game.mistakes} / {PUZZLE_CONFIG.maxMistakes}
          </div>
        )}

<PuzzleBoard
  cols={PUZZLE_CONFIG.cols}
  rows={PUZZLE_CONFIG.rows}
  pieceSize={PUZZLE_CONFIG.pieceSize}
  pieces={game.pieces}
  imageUrl={PUZZLE_CONFIG.imageUrl}
  showHint={game.showHint}
/>
<button
  type="button"
  onClick={() => game.setShowHint((v) => !v)}
  className="mt-4 mx-auto block text-sm text-pink-600 underline"
>
  {game.showHint ? "Hide hint" : "Show hint"}
</button>


<PuzzleTray>
  {game.pieces
    .filter((p) => !p.isPlaced && !p.isDragging)
    .map((piece) => (
      <PuzzlePiece
        key={piece.id}
        piece={piece}
        pieceSize={PUZZLE_CONFIG.pieceSize}
        imageUrl={PUZZLE_CONFIG.imageUrl}
        cols={PUZZLE_CONFIG.cols}
        canSnap={game.canSnap(piece)}
        onPointerDown={(e) => game.grabPiece(e, piece.id)}
      />
    ))}
</PuzzleTray>

{game.pieces
  .filter((p) => p.isDragging || p.isPlaced)
  .map((piece) => (
    <PuzzlePiece
      key={piece.id}
      piece={piece}
      pieceSize={PUZZLE_CONFIG.pieceSize}
      imageUrl={PUZZLE_CONFIG.imageUrl}
      cols={PUZZLE_CONFIG.cols}
      canSnap={game.canSnap(piece)}
      onPointerDown={(e) => game.grabPiece(e, piece.id)}
    />
  ))}


        {game.showResetMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl px-6 py-4 text-pink-600 font-semibold">
              Oops 💔 Try again
            </div>
          </div>
        )}

        {game.isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-xl px-8 py-6 text-center shadow-xl">
              <h2 className="text-2xl font-bold text-pink-600 mb-4">
                You completed it ❤️
              </h2>
              <button
                type="button"
                onClick={handleContinue}
                className="bg-pink-500 text-white px-6 py-2 rounded-full"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Puzzle;
