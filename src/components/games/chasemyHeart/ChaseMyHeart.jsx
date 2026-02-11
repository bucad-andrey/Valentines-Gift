import React, { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GAME_CONFIG, MESSAGES } from "./constants";
import FloatingItem from "./FloatingItem";


const initialState = {
  status: "idle", // idle | playing | won | lost
  score: 0,
  lives: GAME_CONFIG.STARTING_LIVES,
  timeLeft: GAME_CONFIG.TIME_LIMIT,
  items: [],
  message: "",
};

const bombImages = [
  "/bomb.png",
  "/bomb.png",
  "/bomb.png",
];


function gameReducer(state, action) {
    /*
    GAME IDEA : 1ST PAGE
    HEARTS WILL POP UP AND THE RECIEVER SHOULD CLICK THEM
    AFTER CLICKING AS MANY AS REQUIRED THE GAME WILL END
    SOME PICTURE OF THEM WILL POP UP ALSO BUT IT WILL BE A BOMB
    THE GAME WILL RESET IF THE BOMB IS CLICKED
    AFTER COMPLETING IT WILL SAY "YOU TOUCHED MY HEART SUCCESFULLY"
  */

    
  
  switch (action.type) {
    case "START_GAME":
      return {
        ...initialState,
        status: "playing",
      };

    case "TICK":
      if (state.timeLeft <= 1) {
        return {
          ...state,
          status: "lost",
          message: MESSAGES.encouragement,
        };
      }
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };

    case "GAIN_POINT": {
      const newScore = state.score + 1;

      if (newScore >= GAME_CONFIG.HEARTS_TO_WIN) {
        return {
          ...state,
          score: newScore,
          status: "won",
          message: MESSAGES.win,
        };
      }

      return { ...state, score: newScore };
    }

    case "HIT_BOMB": {
      const newLives = state.lives - 1;

      if (newLives <= 0) {
        return {
          ...state,
          lives: 0,
          status: "lost",
          message: MESSAGES.encouragement,
        };
      }

      return { ...state, lives: newLives };
    }

    default:
      return state;
      case "SPAWN_ITEM":
  return {
    ...state,
    items: [...state.items, action.payload],
  };

case "REMOVE_ITEM":
  return {
    ...state,
    items: state.items.filter(item => item.id !== action.payload),
  };

case "CLEAR_ITEMS":
  return {
    ...state,
    items: [],
  };

  }
}

function ChaseMyHeart() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const navigate = useNavigate();

  // Game timer
  useEffect(() => {
    if (state.status !== "playing") return;

    const timer = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "playing") return;
    if (state.items.length >= GAME_CONFIG.MAX_ITEMS) return;
  
    const spawnDelay = Math.random() * 800 + 400; // 400–1200ms
  
    const spawner = setTimeout(() => {
      const isBomb = Math.random() < GAME_CONFIG.BOMB_CHANCE;
  
      const newItem = {
        id: crypto.randomUUID(),
        type: isBomb ? "bomb" : "heart",
        x: Math.random() * 80 + 10,
        size: Math.random() * 30 + 40,
        expiresAt: Date.now() + 3000,
        image: isBomb
          ? bombImages[Math.floor(Math.random() * bombImages.length)]
          :  "/heart.png",
      };
      
  
      dispatch({ type: "SPAWN_ITEM", payload: newItem });
    }, spawnDelay);
  
    return () => clearTimeout(spawner);
  }, [state.items, state.status]);

  useEffect(() => {
    if (state.status !== "playing") return;
  
    const now = Date.now();
  
    state.items.forEach(item => {
      if (item.expiresAt <= now) {
        dispatch({ type: "REMOVE_ITEM", payload: item.id });
      }
    });
  }, [state.items, state.status]);
  
  

  return (
    <div className="relative min-h-screen bg-pink-100 flex flex-col items-center justify-center overflow-hidden">
      {/* HUD */}
      <div className="flex gap-6 text-lg font-semibold mb-4 text-black absolute top-0">
        <span>❤️ {state.score}/{GAME_CONFIG.HEARTS_TO_WIN}</span>
        <span>💣 Lives: {state.lives}</span>
        <span>⏱ {state.timeLeft}s</span>
      </div>

      {/* Messages */}
      {state.status !== "playing" && (
        <div className="text-center text-black">
          <p className="text-xl mb-4">{state.message}</p>
          <button
            onClick={() => {
              if (state.status === "won") {
                navigate("/finalMessage");
              } else {
                dispatch({ type: "START_GAME" });
              }
            }}
            className="px-6 py-3 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition"
          >
            {state.status === "idle"
              ? "Start"
              : state.status === "won"
              ? "Continue"
              : "Play Again"}
          </button>
        </div>
      )}

      {/* Game Field placeholder */}
      {state.status === "playing" && (
  <div className="absolute inset-0">
    {state.items.map(item => (
  <FloatingItem
    key={item.id}
    item={item}
    onClick={() => {
      // ✅ THIS is where it belongs
      if (state.status !== "playing") return;

      dispatch({ type: "REMOVE_ITEM", payload: item.id });

      if (item.type === "heart") {
        dispatch({ type: "GAIN_POINT" });
      } else {
        dispatch({ type: "HIT_BOMB" });
      }
    }}
  />
))}

  </div>
)}

    </div>
  );
}

export default ChaseMyHeart;
