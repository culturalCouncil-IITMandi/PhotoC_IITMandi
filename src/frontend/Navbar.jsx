import React from "react";
import "./Navbar.css";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase config (Replace with your Firebase project config)
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
  const handleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const response = await fetch("https://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkaXZ5YW5zaC5idEBnbWFpbC5jb20iLCJpYXQiOjE3MzkwMDI1NDl9.6zIq45jgf83LAWn5RmYjA69QPAyXT1khsHQIy7eiJLU",
        },
        body: JSON.stringify({ idToken }),
      });
      
      const data = await response.json();
      console.log("Auth Response:", data);
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">PhotoGallery</div>
      <ul className="navbar-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Categories</a></li>
        <li><a href="#">About</a></li>
      </ul>
      <div className="navbar-buttons">
        <button className="auth-btn" onClick={handleAuth}>Login/Register</button>
      </div>
    </nav>
  );
};

export default Navbar;
