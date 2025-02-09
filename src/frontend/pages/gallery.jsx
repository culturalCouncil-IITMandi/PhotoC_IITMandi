import React, { useState, useEffect } from "react";
import FilterTab from "../FilterTab";
import "./gallery.css";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/filter?approved=true`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPhotos(data.files);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  const handleLike = async (photoId) => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please log in to like photos.");
      return;
    }

    const userId = JSON.parse(storedUser).email; // Parse the stored string

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/images/like/${photoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const data = await response.json();

      // Update UI optimistically
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.fileId === photoId ? { ...photo, likes: data.likes } : photo
        )
      );
      
    } catch (error) {
      console.error("Error liking the photo:", error);
    }
  };

  return (
    <>
      {/* <FilterTab /> */}
      <div className="photo-grid-container">
        <div className="photo-grid">
          {photos.map((photo) => (
            <div key={photo._id} className="photo-card">
              <img
                src={photo.seaweedUrl}
                alt={photo.fileName}
                className="photo small-photo"
                onClick={() => setSelectedPhoto(photo)}
              />
              <div className="photo-info">
                <p className="photo-user">{photo.uploader || "Unknown"}</p>
                <p className="photo-date">📅 {new Date(photo.uploadedAt).toLocaleDateString()}</p>
                <p className="photo-title">{photo.title}</p>
                <p className="photo-description">{photo.description}</p>
              </div>
              {/* Like Button */}
              <div className="like-container">
                <button className="like-button" onClick={() => handleLike(photo.fileId)}>
                  ❤️ {photo.likes || 0}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPhoto && (
          <div className="modal" onClick={() => setSelectedPhoto(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setSelectedPhoto(null)}>
                &times;
              </button>
              <div className="modal-photo-container">
                <img src={selectedPhoto.seaweedUrl} alt={selectedPhoto.fileName} className="modal-photo" />
                <div className="photo-details">
                  <h3>{selectedPhoto.fileName}</h3>
                  <p><strong>Uploaded by:</strong> {selectedPhoto.uploader || "Unknown"}</p>
                  <p><strong>Date Uploaded:</strong> 📅 {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}</p>
                  <p><strong>Description:</strong> {selectedPhoto.description || "No description provided."}</p>
                </div>
                <div className="like-container">
                  <button className="like-button" onClick={() => handleLike(selectedPhoto.fileId)}>
                    ❤️ {selectedPhoto.likes || 0}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;
