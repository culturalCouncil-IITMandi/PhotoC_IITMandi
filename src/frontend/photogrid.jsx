import React, { useState, useEffect } from "react";
import "./PhotoGrid.css"; // Your custom CSS file
import tick from "./assets/tick.jpg";
import cross from "./assets/cross.jpg";
import eye from "./assets/eye.jpg";

const PhotoGrid = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/approve', {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "X-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkaXZ5YW5zaC5idEBnbWFpbC5jb20iLCJpYXQiOjE3MzkwMTA3MTZ9.jft2e1tSv41I1KwXrS2dXMyYH02T8LfwlvBs1uol7aY", // Add API key here
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

  const toggleSelectPhoto = (fileId) => {
    setSelectedPhotos((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const approveSelected = () => {
    console.log(`Approved Photos: ${selectedPhotos.join(", ")}`);
    setSelectedPhotos([]);
  };

  const rejectSelected = () => {
    console.log(`Rejected Photos: ${selectedPhotos.join(", ")}`);
    setSelectedPhotos([]);
  };

  return (
    <div className="photo-grid-container">
      <div className="photo-grid">
        {photos.map((photo) => (
          <div
            key={photo.fileId}
            className={`photo-card ${selectedPhotos.includes(photo.fileId) ? "selected" : ""}`}
          >
            <button className="view-button" onClick={() => setSelectedPhoto(photo)}>
              <img className="icon" src={eye} alt="View" />
            </button>

            <img
              src={photo.fileId} // Make sure this is a valid URL or adjust accordingly
              alt={photo.fileName}
              className="photo"
              onClick={() => toggleSelectPhoto(photo.fileId)}
            />

            <div className="photo-details">
              <p><strong>Uploader:</strong> {photo.uploader}</p>
              <p><strong>Uploaded on:</strong> {new Date(photo.uploadedAt).toLocaleDateString()}</p>
            </div>

            <div className="photo-actions">
              <button onClick={() => console.log(`Approved ${photo.fileId}`)}>
                <img className="icon" src={tick} alt="Approve" />
              </button>
              <button onClick={() => console.log(`Rejected ${photo.fileId}`)}>
                <img className="icon" src={cross} alt="Reject" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPhotos.length > 0 && (
        <div className="bulk-actions">
          <button onDoubleClick={approveSelected} className="approve-button">
            Approve
          </button>
          <button onClick={rejectSelected} className="reject-button">
            Reject
          </button>
        </div>
      )}

      {selectedPhoto && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setSelectedPhoto(null)}>&times;</button>
            <img src={selectedPhoto.fileId} alt={selectedPhoto.fileName} className="modal-photo" />
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
