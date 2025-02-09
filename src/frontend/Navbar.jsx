import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase Config from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Navbar = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser((prevUser) => prevUser || JSON.parse(localStorage.getItem("user")));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify({ idToken }),
        mode: "cors",
      });

      if (!response.ok) {
        console.error(`Authentication failed: ${response.status} - ${response.statusText}`);
        setError("Login failed. Please try again.");
        return;
      }

      const data = await response.json();
      const userData = {
        email: result.user.email,
        name: result.user.displayName,
        picture: result.user.photoURL,
        admin1: data.admin1 || false, // Check if user is admin
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setError(null);

      window.location.reload(); // Reload page after login
    } catch (error) {
      console.error("Error during authentication:", error);
      setError("An error occurred during authentication. Please try again.");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("user");
        window.location.reload(); // Reload page after logout
      })
      .catch((error) => console.error("Logout Error:", error));
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">PhotoGallery</Link>
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
            <img src={`https://images.weserv.nl/?url=${encodeURIComponent(user.picture)}`} alt="Profile" className="user-pfp" crossOrigin="anonymous"/>
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
