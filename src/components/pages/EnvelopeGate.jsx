import { useState } from "react";
import { motion, AnimatePresence, color } from "framer-motion";

/*
  EnvelopeGate
  - Romantic 💌 envelope
  - Password inside envelope
  - Hide / Unhide password toggle
  - Fly away on success
  - Reveals next page
*/
export default function EnvelopeGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁 toggle
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const CORRECT_PASSWORD = "iloveyou";

  /*
    Opens envelope once
  */
  const openEnvelope = () => {
    if (!isOpen) setIsOpen(true);
  };

  /*
    Validates password
  */
  const submitPassword = () => {
    if (password === CORRECT_PASSWORD) {
      setError(false);
      setUnlocked(true);
      setTimeout(() => setShowNext(true), 1200);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-rose-100 to-pink-300 overflow-hidden">
      <AnimatePresence>
        {!showNext && (
          <motion.div
            animate={
              unlocked
                ? { y: -500, opacity: 0, scale: 0.8 }
                : { y: 0, opacity: 1 }
            }
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* ENVELOPE */}
            <motion.div
              onClick={openEnvelope}
              whileHover={{ rotateX: 8, rotateY: -8, scale: 1.03 }}
              className="relative w-72 h-48 cursor-pointer perspective-[1200px]"
            >
              {/* BODY */}
              <div className="absolute inset-0 bg-white rounded-xl shadow-xl border border-pink-300 pointer-events-none" />

              {/* LEFT FOLD */}
              <div
                className="absolute inset-y-0 left-0 w-1/2 bg-pink-100 rounded-l-xl pointer-events-none"
                style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
              />

              {/* RIGHT FOLD */}
              <div
                className="absolute inset-y-0 right-0 w-1/2 bg-pink-100 rounded-r-xl pointer-events-none"
                style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }}
              />

              {/* TOP FLAP */}
              <motion.div
                animate={{ rotateX: isOpen ? -160 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-1/2 bg-pink-200 shadow-md pointer-events-none"
                style={{
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  transformOrigin: "top",
                }}
              />

              {/* HEART SEAL 💌 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 bg-pink-500 rotate-45 rounded-sm shadow-lg flex items-center justify-center">
                  <span className="-rotate-45 text-white text-lg">❤</span>
                </div>
              </div>

              {/* PASSWORD CONTENT */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-6 z-20"
                >
                  <p className="text-pink-600 font-semibold mb-2 text-sm">
                    Enter the secret 💕
                  </p>

                  {/* INPUT WRAPPER */}
                  <div className="relative w-full">
                    <motion.input
                      /*
                        Password input
                        - Toggles between text/password
                        - Shakes on error
                      */
                      animate={error ? { x: [-8, 8, -6, 6, 0] } : {}}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-3 py-2 pr-10 rounded-md text-sm
                        bg-white text-pink-700
                        border outline-none
                        ${
                          error
                            ? "border-red-400"
                            : "border-pink-300"
                        }
                      `}
                    />

                    {/* SHOW / HIDE BUTTON */}
                    <div
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-pink-500 text-sm"
                                           
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </div>
                  </div>

                  <button
                    onClick={submitPassword}
                    className="mt-3 px-4 py-1.5 text-sm rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
                  >
                    Open 💗
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEXT PAGE */}
      <AnimatePresence>
        {showNext && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm">
              <h1 className="text-3xl font-bold text-pink-600 mb-4">
                💖 You Made It 💖
              </h1>
              <p className="text-gray-600">
                This is where your love story continues.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
