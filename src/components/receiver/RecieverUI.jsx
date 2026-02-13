import { Routes, Route, Navigate } from "react-router-dom";
import Message1 from "../receiver/Intro";
import Message2 from "../receiver/PictureMessage";
import Message3 from "../receiver/FinalMessage";
import EatMe from '../games/eatMe/EatMe'
import Puzzle from '../games/puzzle/Puzzle'
import Envelope from "../pages/EnvelopeGate";
import ChaseMyHeart from "../games/chasemyHeart/ChaseMyHeart";

function RecieverUI() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Navigate to="/envelope" replace />} />
        <Route path="/envelope" element={<Envelope />} />
        <Route path="/game1" element={<ChaseMyHeart />} />
        <Route path="/introduction" element={<Message1 />} />
        <Route path="/game2" element={<Puzzle /> } />
        <Route path="/pictureMessage" element={<Message2 />} />
        <Route path="/game3" element={<EatMe /> } />
        <Route path="/finalMessage" element={<Message3 />} />
      </Routes>
    </main>
  );
}

export default RecieverUI;