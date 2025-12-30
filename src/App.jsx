import React from "react";
import CreateForm from "./components/sender/CreateForm";
import EventForm from "./components/sender/EventForm";
import { useAuth } from "./components/hooks/userAuth";


function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-white text-2xl font-bold flex items-center justify-center h-screen">Loading...</div>;

  return user ? <EventForm /> : <CreateForm />;
}

export default App;





