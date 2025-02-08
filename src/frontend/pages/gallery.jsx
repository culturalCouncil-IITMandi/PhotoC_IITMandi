import React, { useState, useEffect } from "react";
import FilterTab from "../FilterTab";
import "../PhotoGrid.css"; // Your custom CSS file

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/approve", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkaXZ5YW5zaC5idEBnbWFpbC5jb20iLCJpYXQiOjE3MzkwMTA3MTZ9.jft2e1tSv41I1KwXrS2dXMyYH02T8LfwlvBs1uol7aY",
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

    fetchPhotos();
  }, []);

  return (
    <>
      <FilterTab />
      <div className="photo-grid-container">
        <div className="photo-grid">
          {photos.map((photo) => (
            <div key={photo.fileId} className="photo-card">
              <img
                src={photo.fileId} // Ensure this is a valid URL or adjust accordingly
                alt={photo.fileName}
                className="photo"
                onClick={() => setSelectedPhoto(photo)}
              />
            </div>
          ))}
        </div>

        {selectedPhoto && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-button" onClick={() => setSelectedPhoto(null)}>
                &times;
              </button>
              <img
                src={selectedPhoto.fileId}
                alt={selectedPhoto.fileName}
                className="modal-photo"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;