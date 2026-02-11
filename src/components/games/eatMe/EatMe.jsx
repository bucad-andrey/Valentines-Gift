import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCanvas from "./GameCanvas";
import { useSnakeGame } from "./useSnakeGame";

function EatMe() {
  const game = useSnakeGame();
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

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
  
  const mobileControlCells = useMemo(
    () => [
      { kind: "empty" },
      { kind: "btn", label: "W", dir: "UP", color: "rose" },
      { kind: "empty" },
      { kind: "btn", label: "A", dir: "LEFT", color: "pink" },
      { kind: "heart" },
      { kind: "btn", label: "D", dir: "RIGHT", color: "pink" },
      { kind: "empty" },
      { kind: "btn", label: "S", dir: "DOWN", color: "rose" },
      { kind: "empty" },
    ],
    []
  );

  const handleMobileMove = (dir) => {
    game.changeDirection(dir);
  };

  // Handle ENTER / SPACE after game over
  useEffect(() => {
    const handleKey = (e) => {
      if (game.status === "PLAYING") return;
      if (e.key === "Enter" || e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (game.status === "WIN") {
          navigate("/finalMessage");
        } else {
          game.resetGame();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [game.status, navigate, game]);

  return (
    <div className="relative text-center flex justify-center px-4">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary-text mb-2">
          Eat Me <span className="inline-block">💖</span>
        </h2>
        <p className="text-sm text-primary-text/70 mb-4">
          Desktop: use <span className="font-semibold">W A S D</span> • Mobile: use the buttons below
        </p>

        <div className="flex flex-col items-center">
          <GameCanvas snake={game.snake} food={game.food} />

          {/* Mobile Controls BELOW the board */}
          <div className="sm:hidden mt-4">
            <div className="rounded-3xl bg-white/55 backdrop-blur-xl border border-white/40 shadow-(--box-shadow-soft) px-3 py-3">
              <div className="grid grid-cols-3 gap-2 place-items-center">
                {mobileControlCells.map((cell, idx) => {
                  if (cell.kind === "empty") {
                    return <div key={idx} className="w-12 h-12" />;
                  }

                  if (cell.kind === "heart") {
                    return (
                      <div
                        key={idx}
                        className="w-12 h-12 rounded-2xl bg-transparent border border-white/40 flex items-center justify-center text-rose-500 shadow"
                        aria-hidden="true"
                      >
                        💗
                      </div>
                    );
                  }

                  const base =
                    "w-12 h-12 bg-transparent rounded-2xl text-white font-semibold shadow-lg active:scale-95 transition flex items-center justify-center border border-white/40";
                  const color =
                    cell.color === "rose" ? "bg-rose-500" : "bg-pink-500";

                  return (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Move ${cell.dir.toLowerCase()}`}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        handleMobileMove(cell.dir);
                      }}
                      onClick={() => handleMobileMove(cell.dir)}
                      className={`${base} ${color}`}
                    >
                      {cell.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-3">
          <p className="text-primary-text font-medium">
            Score: <span className="font-semibold">{game.score}</span>
          </p>
          <span className="text-primary-text/40">•</span>
          <p className="text-primary-text/80 text-sm">
            Goal: {game.score}/{10}
          </p>
        </div>

        <p className="sm:hidden mt-4 text-xs text-primary-text/70">
          Tip: tap gently—no need to hold.
        </p>
      </div>

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

          <div style={{ marginTop: "5px", display: "flex", gap: "12px" }}>
            {(game.status === "LOSE" || game.status === "WALL") && (
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                onClick={handleTryAgain}
              >
                Try Again
              </button>
            )}

            {game.status === "WIN" && (
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/finalMessage")}
              >
                See Final Message
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EatMe;
