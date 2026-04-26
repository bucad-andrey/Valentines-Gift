import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "../../../app/routes";

import { Letter } from "../letter/Letter";
import LetterContainer from "../letter/LetterContainer";
import LoveCardPage from "../message2/LoveCardPage";
import InvitePage from "../invitation/InvitePage";
import { GenerateURL } from "../url/GenerateURL";

export function SenderRoutes() {
  return (
    <main className="pt-20 px-6">
      <Routes>
        <Route path={ROUTES.sender.root} element={<Navigate to={ROUTES.sender.letter} replace />} />
        <Route path={ROUTES.sender.letter} element={<Letter />} />
        <Route path={ROUTES.sender.preLetter} element={<LetterContainer />} />
        <Route path={ROUTES.sender.message2} element={<LoveCardPage />} />
        <Route path={ROUTES.sender.message3} element={<InvitePage />} />
        <Route path={ROUTES.sender.generateUrl} element={<GenerateURL />} />
      </Routes>
    </main>
  );
}

