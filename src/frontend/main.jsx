import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import BelowHero from "./BelowHero";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Approval from "./pages/approval";
import Gallery from "./pages/gallery";
import About from "./pages/about";
import Upload from "./pages/upload";

// Protected Route Component for Admins
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.admin1 ? children : <Navigate to="/" replace />;
};

// Protected Route Component for Logged-in Users
const AuthRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/" replace />;
};

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
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        
        {/* Protect the Upload Page for Logged-in Users */}
        <Route
          path="/upload"
          element={
            <AuthRoute>
              <Upload />
            </AuthRoute>
          }
        />

        {/* Protect the Approval Page for Admins */}
        <Route
          path="/approval"
          element={
            <AdminRoute>
              <Approval />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>
);
