import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import BelowHero from "./BelowHero";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Approval from "./pages/approval"; // Capitalized correctly
import Gallery from "./pages/gallery"; // Capitalized correctly
import About from "./pages/about"; // Capitalized correctly
import Upload from "./pages/upload"; // Capitalized correctly

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <BelowHero />
            </>
          }
        />
        <Route path="/approval" element={<Approval />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>
);
