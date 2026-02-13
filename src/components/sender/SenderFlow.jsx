import React from "react";
import CreateForm from "../sender/CreateForm";
import EventForm from "../sender/EventForm";
import { useAuth } from "../hooks/userAuth";


function SenderFlow() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-white text-2xl font-bold flex items-center justify-center min-h-screen">Loading...</div>;

  return user ? <EventForm /> : <CreateForm />;
}

export default SenderFlow;





