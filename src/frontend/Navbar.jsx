import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCkohhYNR0SuASC_jTNoRHDNW3EcoLPghE",
  authDomain: "photo-gallery-iitmd.firebaseapp.com",
  projectId: "photo-gallery-iitmd",
  storageBucket: "photo-gallery-iitmd.appspot.com",
  messagingSenderId: "163087163057",
  appId: "1:163087163057:web:f9a8d5c9e4e284c0958c90",
  measurementId: "G-ML0G3WHGCW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/upload">Upload</Link></li>
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
