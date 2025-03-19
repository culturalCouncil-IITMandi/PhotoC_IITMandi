import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ToastContainer, toast } from "react-toastify";
import { customToastContainerStyle } from "./components/Toast";
import "react-toastify/dist/ReactToastify.css";

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

// Main App Component
const App = () => {
  return (
    <Router>
      <div id="root">
        <Navbar />
        <div className="page-container">
          <div className="main-content">
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

              {/* Protected Upload Page for Logged-in Users */}
              <Route
                path="/upload"
                element={
                  <AuthRoute>
                    <Upload />
                  </AuthRoute>
                }
              />

              {/* Protected Approval Page for Admins */}
              <Route
                path="/approval"
                element={
                  <AdminRoute>
                    <Approval />
                  </AdminRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
        <ToastContainer theme="dark" toastStyle={customToastContainerStyle} />
      </div>
    </Router>
  );
};

// Render App
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
