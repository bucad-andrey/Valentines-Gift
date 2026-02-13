import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReceiverPage from "./components/receiver/RecieverUI";
import SenderFlow from "./components/sender/SenderFlow";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SenderFlow />} />
        <Route path="/love/:giftId" element={<ReceiverPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
