import React, { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GAME_CONFIG, bombImages } from "./constants";
import { gameReducer, initialState } from "./reducer";
import FloatingItem from "./FloatingItem";
import heartImg from "/heart.png";

const DEBUG_CHASE_MY_HEART =
  (typeof import.meta !== "undefined" && import.meta.env?.DEV) ||
  (typeof window !== "undefined" &&
    window.localStorage?.getItem("debugChaseMyHeart") === "1");

function ChaseMyHeart() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const navigate = useNavigate();
  /*
    FUNCTIONALITY:
    Debug reducer state changes
    */
    useEffect(() => {
      console.log("[DEBUG] state updated:", state);
    }, [state]);

  useEffect(() => {
    if (!DEBUG_CHASE_MY_HEART) return;

    const resolved = (path) => {
      try {
        return new URL(path, window.location.href).toString();
      } catch {
        return path;
      }
    };

    console.log("[ChaseMyHeart] mounted", {
      href: window.location.href,
      origin: window.location.origin,
      baseURI: document.baseURI,
      heartPng: resolved(heartImg),
      bombPng: resolved("/bomb.png"),
      ua: navigator.userAgent,
    });
  }, []);

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
          :  heartImg,
      };
      
      if (DEBUG_CHASE_MY_HEART) {
        console.log("[ChaseMyHeart] spawn", {
          id: newItem.id,
          type: newItem.type,
          x: newItem.x,
          size: newItem.size,
          image: newItem.image,
          resolvedImage: (() => {
            try {
              return new URL(newItem.image, window.location.href).toString();
            } catch {
              return newItem.image;
            }
          })(),
          itemsCountBefore: state.items.length,
        });
      }

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
    <div className="w-full relative min-h-screen bg-pink-100 flex flex-col items-center justify-center overflow-hidden">
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
                navigate("../introduction");
                if (DEBUG_CHASE_MY_HEART) {
                  console.log("[ChaseMyHeart] continue clicked", {
                    path: window.location.pathname,
                  });
                }
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

              if (DEBUG_CHASE_MY_HEART) {
                console.log("[ChaseMyHeart] click item", {
                  id: item.id,
                  type: item.type,
                  image: item.image,
                  scoreBefore: state.score,
                  livesBefore: state.lives,
                  timeLeft: state.timeLeft,
                });
              }

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
