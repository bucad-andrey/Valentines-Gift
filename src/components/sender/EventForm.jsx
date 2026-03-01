import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "../ui/Header";
import MainContent from "../ui/MainContent";
import { SpeedInsights } from '@vercel/speed-insights/react';

function EventForm() {
  return (
    <BrowserRouter>
      <Header />
      <MainContent />
    </BrowserRouter>
  );
}

export default EventForm;
