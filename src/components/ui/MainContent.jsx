import { Routes, Route, Navigate } from "react-router-dom";
import Message2 from "../sender/Message 2/LoveCardPage";
import Message3 from "../sender/Invitation/InvitePage";
import Letter from "../sender/Letter/Letter";
import PreLetter from "../sender/Letter/LetterContainer"
import GenerateUrl from "../sender/GenerateURL";

function MainContent() {
  return (
    <main className="pt-20 px-6">

      <Routes>
        <Route path="/" element={<Navigate to="/letter" replace />} />
        <Route path="/letter" element={<Letter />} />
        <Route path="/preLetter" element={<PreLetter/>} />
        <Route path="/message2" element={<Message2 />} />
        <Route path="/message3" element={<Message3 />} />
        <Route path="/generateUrl" element={<GenerateUrl />} />
      </Routes>

    </main>
  );
}

export default MainContent;