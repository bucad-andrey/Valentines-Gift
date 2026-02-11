import { useNavigate } from "react-router-dom";
import PuzzleBoard from "./PuzzleBoard";
import PuzzlePiece from "./PuzzlePiece";
import { usePuzzleGame } from "./usePuzzleGame";
import PuzzleTray from "./PuzzleTray";


function Puzzle({ onComplete }) {
  const navigate = useNavigate();

  const CONFIG = {
    cols: 3,
    rows: 2,
    pieceSize: 100,
    snapDistance: 300,
    maxMistakes: 50,
    imageUrl: "https://picsum.photos/600/400",
  };

  const game = usePuzzleGame(CONFIG);

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
          width: CONFIG.cols * CONFIG.pieceSize + 40,
          height: CONFIG.rows * CONFIG.pieceSize + 220,
        }}
        onPointerMove={game.movePiece}
        onPointerUp={game.releasePiece}
        onPointerCancel={game.releasePiece}
      >
        {!game.isCompleted && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-pink-600 font-semibold">
            Mistakes: {game.mistakes} / {CONFIG.maxMistakes}
          </div>
        )}

<PuzzleBoard
  cols={CONFIG.cols}
  rows={CONFIG.rows}
  pieceSize={CONFIG.pieceSize}
  pieces={game.pieces}
  imageUrl={CONFIG.imageUrl}
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
        pieceSize={CONFIG.pieceSize}
        imageUrl={CONFIG.imageUrl}
        cols={CONFIG.cols}
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
      pieceSize={CONFIG.pieceSize}
      imageUrl={CONFIG.imageUrl}
      cols={CONFIG.cols}
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