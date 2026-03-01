import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateForm from "./components/sender/CreateForm";
import EventForm from "./components/sender/EventForm";
import ReceiverUI from "./components/receiver/RecieverUI";
import { useAuth } from "./components/hooks/userAuth";

function App() {
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

        {/* Receiver Route */}
        <Route path="/love/:giftId/*" element={<ReceiverUI />} />

        {/* Sender Routes */}
        <Route
          path="/*"
          element={user ? <EventForm /> : <CreateForm />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;