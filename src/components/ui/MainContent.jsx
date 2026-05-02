import { Routes, Route, Navigate } from "react-router-dom";
import Message2 from "../../features/sender/message/LoveCardPage";
import Message3 from "../../features/sender/Invitation/InvitePage";
import Letter from "../../features/sender/Letter/LetterContainer"
import GenerateUrl from "../sender/GenerateURL";
import IntroductionLetter from "../receiver/Introduction/IntroductionLetter";

function MainContent() {
  return (
    <main className="pt-20 px-6 min-h-screen bg-gradient-to-br from-primary-soft to-secondary-soft">

      <Routes>
        <Route path="/" element={<Navigate to="/letter" replace />} />
        <Route path="letter" element={<Letter/>} />
        <Route paht='/preview' element={<IntroductionLetter />} />
        <Route path="/message2" element={<Message2 />} />
        <Route path="/message3" element={<Message3 />} />
        <Route path="/letter" element={<Letter />} />
        <Route path="/generateUrl" element={<GenerateUrl />} />
      </Routes>

    </main>
  );
}

export default MainContent;