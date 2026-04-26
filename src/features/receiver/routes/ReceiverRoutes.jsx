import { Navigate, Route, Routes, useParams } from "react-router-dom";

import { EnvelopeGate } from "../views/EnvelopeGate";
import { Intro } from "../views/Intro";
import { PictureMessage } from "../views/PictureMessage";
import { FinalMessage } from "../views/FinalMessage";
import { Ending } from "../views/Ending";

import { ChaseMyHeart } from "../../games/chase-my-heart/ChaseMyHeart";
import { Puzzle } from "../../games/puzzle/Puzzle";
import { EatMe } from "../../games/eat-me/EatMe";
import { PreviewLetter } from "../views/PreviewLetter";

export function ReceiverRoutes() {
  const { giftId } = useParams();

  return (
    <main className="pt-6 md:px-6">
      <Routes>
        <Route path="/" element={<EnvelopeGate />} />

        <Route path="game1" element={<ChaseMyHeart />} />
        <Route path="introduction" element={<PreviewLetter userId={giftId} />} />
        <Route path="game2" element={<Puzzle />} />
        <Route path="pictureMessage" element={<PictureMessage userId={giftId} />} />
        <Route path="game3" element={<EatMe />} />
        <Route path="finalMessage" element={<FinalMessage userId={giftId} />} />
        <Route path="ending" element={<Ending />} />

        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </main>
  );
}

