// Single source of truth for route strings.
// Keep this file small and boring: constants only.

export const ROUTES = {
  sender: {
    root: "/",
    letter: "/letter",
    preLetter: "/preLetter",
    message2: "/message2",
    message3: "/message3",
    generateUrl: "/generateUrl",
  },
  receiver: {
    root: "/love/:giftId/*",
  },
};

