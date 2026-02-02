import { useEffect, useState } from "react";
import GameCanvas from "./GameCanvas";
import { useSnakeGame } from "./useSnakeGame";

function EatMe() {
  const game = useSnakeGame();
  const [showOverlay, setShowOverlay] = useState(false);

  // Show overlay when game ends
  useEffect(() => {
    if (game.status === "WIN" || game.status === "LOSE" || game.status === "WALL") {
      setShowOverlay(true);
    } else {
      setShowOverlay(false);
    }
  }, [game.status]);

  // Reset game
  const handleTryAgain = () => {
    game.resetGame();
  };
  

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <h2>Eat Me 💖</h2>
      <GameCanvas snake={game.snake} food={game.food} />
      <p>Score: {game.score}</p>

      {/* Overlay */}
      {showOverlay && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
        >
          {game.status === "WIN" && <p className="text-black">You won 💖</p>}
          {game.status === "LOSE" && <p className="text-black">Don't eat yourself 😅</p>}
          {game.status === "WALL" && <p className="text-black">Don't eat the wall 😂</p>}

          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "18px",
              cursor: "pointer",
            }}
            onClick={handleTryAgain}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default EatMe;
