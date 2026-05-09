import { Routes, Route, Navigate } from "react-router-dom";
import Memories from "../../features/sender/message/LoveCardPage";
import Invitation from "../../features/sender/Invitation/InvitePage";
import Letter from "../../features/sender/Letter/LetterContainer"
import GenerateUrl from "../../features/sender/url/GenerateURL";
import IntroductionLetter from "../../features/receiver/Introduction/IntroductionLetter";
import PuzzleInput from "../../features/sender/game/puzzleUploader/components/PuzzleUploader";

function MainContent() {
  return (
    <main className="pt-20 px-6 min-h-screen bg-gradient-to-br from-primary-soft to-secondary-soft">

      <Routes>
        <Route path="/" element={<Navigate to="/letter" replace />} />
        <Route path="letter" element={<Letter/>} />
        <Route paht='/preview' element={<IntroductionLetter />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/invitation" element={<Invitation />} />
        <Route path="/puzzle" element={<PuzzleInput userEmail={"Y3cWoMJV05dTCdKQSlvGzb65gPh1"}/>} />
        <Route path="/generateUrl" element={<GenerateUrl />} />
      </Routes>

    </main>
  );
}

export default MainContent;