import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Intro from "../receiver/Intro";
import PictureMessage from "../receiver/PictureMessage";
import FinalMessage from "../receiver/FinalMessage";
import EatMe from "../games/eatMe/EatMe";
import Puzzle from "../games/puzzle/Puzzle";
import ChaseMyHeart from "../games/chasemyHeart/ChaseMyHeart";
import Envelope from "../pages/EnvelopeGate";
import Ending from "./Ending";

function RecieverUI() {
  const { giftId } = useParams();

  console.log("🎁 Receiver giftId:", giftId);

  return (
    <main className="pt-20 px-6">

      <Routes>
        {/* Default entry */}
        <Route path="/" element={<Envelope />} />

        <Route path="/introduction" element={<Intro />} />
        <Route path="/game1" element={<ChaseMyHeart />} />
        <Route path="/game2" element={<Puzzle />} />
        <Route path="/game3" element={<EatMe />} />
        <Route path="/pictureMessage" element={<PictureMessage />} />
        <Route path="/finalMessage" element={<FinalMessage />} />
        <Route path="/ending" element={<Ending />} />

        {/* Safety fallback */}
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>

    </main>
  );
}

export default RecieverUI;