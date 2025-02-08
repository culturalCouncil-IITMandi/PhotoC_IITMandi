import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router
import "./index.css";
import BelowHero from "./BelowHero.jsx";
import Hero from "./Hero.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Approval from "./pages/approval.jsx"; // Import Approval Page

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <BelowHero />
          </>
        } />
        <Route path="/approval" element={<Approval />} />
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>
);
