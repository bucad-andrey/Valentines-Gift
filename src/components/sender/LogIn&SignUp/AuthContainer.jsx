import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AUTH_VIEW } from "./constants";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPassword from "./ForgotPassword";
import VerifyEmail from "./VerifyEmail";

// FUNCTIONALITY: animation variants for sliding effect
const slideVariants = {
  initial: (direction) => ({
    x: direction === "forward" ? 300 : -300,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction === "forward" ? -300 : 300,
    opacity: 0,
  }),
};

export default function AuthContainer() {
  // FUNCTIONALITY: current active view
  const [view, setView] = useState(AUTH_VIEW.LOGIN);

  // FUNCTIONALITY: track direction for animation
  const [direction, setDirection] = useState("forward");

  // FUNCTIONALITY: debug current view
  console.log("Current Auth View:", view);

  // FUNCTIONALITY: handle navigation with direction awareness
  const navigate = (nextView) => {
    const order = [
      AUTH_VIEW.LOGIN,
      AUTH_VIEW.SIGNUP,
      AUTH_VIEW.FORGOT_PASSWORD,
      AUTH_VIEW.VERIFY_EMAIL,
    ];

    const currentIndex = order.indexOf(view);
    const nextIndex = order.indexOf(nextView);

    setDirection(nextIndex > currentIndex ? "forward" : "backward");
    setView(nextView);
  };

  // FUNCTIONALITY: render correct component
  const renderView = () => {
    switch (view) {
      case AUTH_VIEW.LOGIN:
        return <LoginForm navigate={navigate} />;
      case AUTH_VIEW.SIGNUP:
        return <SignupForm navigate={navigate} />;
      case AUTH_VIEW.FORGOT_PASSWORD:
        return <ForgotPassword navigate={navigate} />;
      case AUTH_VIEW.VERIFY_EMAIL:
        return <VerifyEmail navigate={navigate} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* LEFT SIDE (decorative / branding) */}
      <div className="w-1/2 bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white">
        <h1 className="text-4xl font-bold">Welcome</h1>
      </div>

      {/* RIGHT SIDE (forms) */}
      <div className="w-1/2 flex items-center justify-center overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={view}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="absolute w-full max-w-md"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}