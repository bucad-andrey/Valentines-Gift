import { Routes, Route, Navigate } from "react-router-dom";
import Message1 from "../pages/IntroPage";
import Message2 from "../pages/LovePage";
import Message3 from "../pages/SharePage";

function MainContent() {
  return (
    <main className="pt-20 px-6">

      <Routes>
        <Route path="/" element={<Navigate to="/message1" replace />} />
        <Route path="/message1" element={<Message1 />} />
        <Route path="/message2" element={<Message2 />} />
        <Route path="/message3" element={<Message3 />} />
      </Routes>
    </main>
  );
}

export default MainContent;
