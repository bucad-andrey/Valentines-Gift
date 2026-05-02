import { useState, useRef, useEffect } from "react";
import { GAME_CONFIG } from "./gameConfig";


/*
  FIX THE OVERLAY AND THE AWSD FUNCTION
  I GUESS THAT IS BECAUSE OF THE OVERLAY THAT IS WHY THE ASWD IS NOT WORKING
  SO SOLVE THEM
*/

const OPPOSITE = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

export function useSnakeGame() {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);

  const [food, setFood] = useState({ x: 15, y: 10 });
  const [direction, setDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("PLAYING");

  const intervalRef = useRef(null);

  // Change direction safely
  const changeDirection = (newDir) => {
    setDirection((prev) => {
      if (OPPOSITE[newDir] === prev) return prev;
      return newDir;
    });
  };

  // Generate random food position not inside provided snake
  const generateFood = (snakeArr) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
        y: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
      };
    } while (
      (snakeArr || []).some((part) => part.x === newFood.x && part.y === newFood.y)
    );
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      try {
        switch (e.key.toLowerCase()) {
          case "w":
            changeDirection("UP");
            break;
          case "s":
            changeDirection("DOWN");
            break;
          case "a":
            changeDirection("LEFT");
            break;
          case "d":
            changeDirection("RIGHT");
            break;
          default:
            break;
        }
      } catch (err) {
        console.error("[KEYBOARD ERROR]", err);
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  

  // Game loop
  useEffect(() => {
    if (status !== "PLAYING") return;

    intervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead;

        // Determine new head based on direction
        switch (direction) {
          case "UP":
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case "DOWN":
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case "LEFT":
            newHead = { x: head.x - 1, y: head.y };
            break;
          case "RIGHT":
            newHead = { x: head.x + 1, y: head.y };
            break;
          default:
            newHead = head;
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GAME_CONFIG.GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GAME_CONFIG.GRID_SIZE
        ) {
          console.warn("[GAME] Wall collision", newHead);
          clearInterval(intervalRef.current);
          setStatus("WALL");
          return prevSnake;
        }
        

        // Check self collision
        if (prevSnake.some((part) => part.x === newHead.x && part.y === newHead.y)) {
          clearInterval(intervalRef.current);
          setStatus("LOSE");
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        // Check if food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => {
            const next = prev + 1;
            if (next >= GAME_CONFIG.WIN_SCORE) {
              clearInterval(intervalRef.current);
              setStatus("WIN");
            } else {
              // Generate food that won't spawn inside the grown snake
              generateFood(newSnake);
            }
            return next;
          });
        } else {
          // Remove tail if food not eaten
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_CONFIG.SPEED);

    return () => clearInterval(intervalRef.current);
  }, [direction, status, food]);

  useEffect(() => {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error("[GLOBAL ERROR]", {
        message,
        source,
        lineno,
        colno,
        error,
      });
    };
  }, []);

  
  //GAME RESET
  const resetGame = () => {
    try {
      clearInterval(intervalRef.current);
  
      setSnake([
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ]);
  
      setFood({ x: 15, y: 10 });
      setDirection("RIGHT");
      setScore(0);
      setStatus("PLAYING");
  
      console.info("[GAME] Reset successful");
    } catch (err) {
      console.error("[GAME RESET ERROR]", err);
    }
  };
  

  return {
    snake,
    food,
    direction,
    score,
    status,
    changeDirection,
    setStatus,
    resetGame,
  };
}
