import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Redirect non-admins
import "./PhotoGrid.css";
import tick from "./assets/tick.jpg";
import cross from "./assets/cross.jpg";
import eye from "./assets/eye.jpg";

const PhotoGrid = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // Default to null to avoid flicker
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For redirecting users

  useEffect(() => {
    // Read from localStorage synchronously
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsAdmin(user.admin1 === true); // Ensure it's a boolean
      } catch (e) {
        console.error("Error parsing user data:", e);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      setError("You do not have permission to access this page.");
    } else if (isAdmin === true) {
      fetchPhotos();
    }
  }, [isAdmin]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/approve", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "your_api_key_here",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const handleApprove = async (fileId) => {
    if (!isAdmin) return; // Failsafe

    try {
      const response = await fetch(`http://localhost:5000/api/approve/${fileId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "your_api_key_here",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchPhotos();
    } catch (error) {
      console.error("Error approving photo:", error);
    }
  };

  const handleReject = async (fileId) => {
    if (!isAdmin) return; // Failsafe

    try {
      const response = await fetch(`http://localhost:5000/api/approve/${fileId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "your_api_key_here",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchPhotos();
    } catch (error) {
      console.error("Error rejecting photo:", error);
    }
  };

  // Prevent rendering anything until isAdmin is determined
  if (isAdmin === null) return <div>Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="error-container">
        <h2>Access Denied</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="photo-grid-container">
      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo.fileId} className="photo-card">
            <button className="view-button" onClick={() => setSelectedPhoto(photo)}>
              <img className="icon" src={eye} alt="View" />
            </button>

            <img
              src={`http://localhost:9333/${photo.fileId}`}
              alt={photo.fileName}
              className="photo"
            />

            {/* <div className="photo-details">
              <p><strong>Uploader:</strong> {photo.uploader}</p>
              <p><strong>Uploaded on:</strong> {new Date(photo.uploadedAt).toLocaleDateString()}</p>
            </div> */}

            <div className="photo-actions">
              <button onClick={() => handleApprove(photo.fileId)} disabled={!isAdmin}>
                <img className="icon" src={tick} alt="Approve" />
              </button>
              <button onClick={() => handleReject(photo.fileId)} disabled={!isAdmin}>
                <img className="icon" src={cross} alt="Reject" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setSelectedPhoto(null)}>&times;</button>
            <img src={`http://localhost:9333/${selectedPhoto.fileId}`} alt={selectedPhoto.fileName} className="modal-photo" />
            <p><strong>Uploader:</strong> {selectedPhoto.uploader}</p>
            <p><strong>Email:</strong> {selectedPhoto.uploaderEmail}</p>
            <p><strong>Uploaded on:</strong> {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}</p>
            <p><strong>Likes:</strong> {selectedPhoto.likes}</p>
            <p className={selectedPhoto.approval ? "approved" : "pending"}>
              {selectedPhoto.approval ? "Approved" : "Pending"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
