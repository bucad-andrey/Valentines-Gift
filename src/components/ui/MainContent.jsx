import { Routes, Route, Navigate } from "react-router-dom";
import Message1 from "../pages/IntroPage";
import Message2 from "../pages/LovePage";
import Message3 from "../pages/SharePage";
import Preview from "../games/puzzle/Puzzle";
import ChaseMe from '../games/chasemyHeart/ChaseMyHeart'
import EatMe from '../games/eatMe/EatMe'
import Puzzle from '../games/puzzle/Puzzle'
import Envelope from '../pages/EnvelopeGate'

function MainContent() {
  return (
    <main className="pt-20 px-6">

      <Routes>
        <Route path="/" element={<Navigate to="/message1" replace />} />
        <Route path="/envelope" element={<Envelope />} />
        <Route path="/message1" element={<Message1 />} />
        <Route path="/message2" element={<Message2 />} />
        <Route path="/message3" element={<Message3 />} />
        <Route path="/game1" element={<ChaseMe /> } />
        <Route path="/game2" element={<EatMe /> } />
        <Route path="/game3" element={<Puzzle /> } />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </main>
  );
}

export default MainContent;