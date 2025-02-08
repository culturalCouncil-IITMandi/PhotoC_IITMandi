import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Navbar.css";
import Approval from './pages/approval.jsx'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCkohhYNR0SuASC_jTNoRHDNW3EcoLPghE",
  authDomain: "photo-gallery-iitmd.firebaseapp.com",
  projectId: "photo-gallery-iitmd",
  storageBucket: "photo-gallery-iitmd.firebasestorage.app",
  messagingSenderId: "163087163057",
  appId: "1:163087163057:web:f9a8d5c9e4e284c0958c90",
  measurementId: "G-ML0G3WHGCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkaXZ5YW5zaC5idEBnbWFpbC5jb20iLCJpYXQiOjE3MzkwMDc3NjV9.4PySBx5wIqC5QMp8s67NaS3tF705uuuPbaj9xs45HjA",
        },
        body: JSON.stringify({ idToken }),
        mode: "cors",
      });

      if (!response.ok) {
        console.error(`Authentication failed: ${response.status} - ${response.statusText}`);
        return;
      }

      const data = await response.json();
      console.log("Auth Response:", data);

      setUser(data);
    } catch (error) {
      console.error("Error during authentication:", error);
      setError("An error occurred during authentication. Please try again.");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.error("Logout Error:", error));
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">PhotoGallery</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="#">Categories</Link></li>
        <li><Link to="#">About</Link></li>
        {user?.admin1 && <li><Link to="/approval">Approval</Link></li>}
      </ul>
      <div className="navbar-buttons">
        {user ? (
          <div className="user-profile">
            <img src={user.picture || "default-avatar.png"} alt="Profile" className="user-pfp" />
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="auth-btn" onClick={handleAuth}>Login/Register</button>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
    </nav>
  );
};

export default Navbar;
