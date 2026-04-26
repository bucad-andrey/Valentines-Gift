import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";

import { useAuth } from "../shared/hooks/useAuth";
import { CreateForm } from "../features/sender/auth/CreateForm";
import { SenderShell } from "../features/sender/shell/SenderShell";
import { ReceiverUI } from "../features/receiver/routes/ReceiverUI";

export function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-white text-2xl font-bold flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.receiver.root} element={<ReceiverUI />} />
        <Route path="/*" element={user ? <SenderShell /> : <CreateForm />} />
      </Routes>
    </BrowserRouter>
  );
}

