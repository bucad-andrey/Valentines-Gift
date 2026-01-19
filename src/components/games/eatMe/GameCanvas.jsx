import { useEffect, useRef } from "react";
import { GAME_CONFIG } from "./gameConfig";
import headImg from "./head.jpg"; // <-- your snake head image here

function GameCanvas({ snake, food }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const size = GAME_CONFIG.CANVAS_MAX_SIZE;
    canvas.width = size;
    canvas.height = size;
    const cellSize = size / GAME_CONFIG.GRID_SIZE;

    ctx.clearRect(0, 0, size, size);

    // Draw snake body (hearts)
    ctx.fillStyle = "pink";
    snake.slice(1).forEach((part) => {
      ctx.fillText("💖", part.x * cellSize + 2, part.y * cellSize + cellSize - 2);
    });

    // Draw snake head (image)
    const head = snake[0];
    const img = new Image();
    img.src = headImg;
    img.onload = () => {
      ctx.drawImage(img, head.x * cellSize, head.y * cellSize, cellSize, cellSize);
    };

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
  }, [snake, food]);

  return <canvas ref={canvasRef} />;
}

export default GameCanvas;
