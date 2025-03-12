import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "./gallery.css";

const Gallery = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filters, setFilters] = useState({
    event: queryParams.get("event") || "",
    uploader: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      event: queryParams.get("event") || prevFilters.event,
    }));
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/filter?approved=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const filtered = data.files.filter(
        (photo) => !filters.event || photo.event === filters.event
      );

      setPhotos(data.files || []);
      setFilteredPhotos(filtered || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setPhotos([]);
      setFilteredPhotos([]);
    }
  };

  const applyFilters = useCallback(() => {
    setFilteredPhotos(
      photos.filter((photo) => {
        return (
          (!filters.event || photo.event === filters.event) &&
          (!filters.uploader || photo.uploader === filters.uploader) &&
          (!filters.startDate ||
            new Date(photo.uploadedAt) >= new Date(filters.startDate)) &&
          (!filters.endDate ||
            new Date(photo.uploadedAt) <= new Date(filters.endDate))
        );
      })
    );
  }, [filters, photos]);

  const handleLike = async (photoId) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please log in to like photos.");
      return;
    }

    const userId = JSON.parse(storedUser).email;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/images/like/${photoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) throw new Error("Failed to update like");

      const data = await response.json();
      setPhotos((prevPhotos) => [
        ...prevPhotos.map((photo) =>
          photo.fileId === photoId ? { ...photo, likes: data.likes } : photo
        ),
      ]);
    } catch (error) {
      console.error("Error liking the photo:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const uniqueEvents = [
    ...new Set(photos.map((photo) => photo.event).filter(Boolean)),
  ];
  const uniqueUploaders = [
    ...new Set(photos.map((photo) => photo.uploader).filter(Boolean)),
  ];

  return (
    <>
      <div className="filter-tab">
        <select
          name="event"
          value={filters.event}
          onChange={handleFilterChange}
        >
          <option value="">All Events</option>
          {uniqueEvents.map((event, index) => (
            <option key={index} value={event}>
              {event}
            </option>
          ))}
        </select>

        <select
          name="uploader"
          value={filters.uploader}
          onChange={handleFilterChange}
        >
          <option value="">All Uploaders</option>
          {uniqueUploaders.map((uploader, index) => (
            <option key={index} value={uploader}>
              {uploader}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
      </div>

      <div className="photo-grid-container">
        {filteredPhotos.length === 0 ? (
          <p className="no-photos">No photos found</p>
        ) : (
          <div className="photo-grid">
            {filteredPhotos.map((photo) => (
              <div key={photo.fileId} className="photo-card">
                <img
                  src={`${import.meta.env.VITE_SEAWEEDFS_URL_DOWNLOAD}/${
                    photo.fileId
                  }`}
                  alt={photo.fileName}
                  className="photo small-photo"
                  onClick={() => setSelectedPhoto(photo)}
                />
                <div className="photo-info">
                  <p className="photo-user">{photo.uploader || "Unknown"}</p>
                  <p className="photo-date">
                    📅 {new Date(photo.uploadedAt).toLocaleDateString()}
                  </p>
                  <p className="photo-title">{photo.title}</p>
                  <p className="photo-event">{`Event: ${photo.event}`}</p>
                </div>
                <div className="like-container">
                  <button
                    className="like-button"
                    onClick={() => {
                      handleLike(photo.fileId);
                    }}
                  >
                    ❤️{" "}
                    {photos.find((p) => p.fileId === photo.fileId).likes || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPhoto && (
          <div className="modal" onClick={() => setSelectedPhoto(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-button"
                onClick={() => setSelectedPhoto(null)}
              >
                &times;
              </button>

              <div className="modal-photo-container">
                <img
                  src={selectedPhoto.seaweedUrl}
                  alt={selectedPhoto.fileName}
                  className="modal-photo"
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/images/download/${
                          selectedPhoto.fileId
                        }`,
                        {
                          method: "GET",
                          headers: {
                            "X-API-KEY": import.meta.env.VITE_X_API_KEY,
                          },
                        }
                      );
                      if (!response.ok) {
                        throw new Error(
                          `HTTP error! Status: ${response.status}`
                        );
                      }
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = selectedPhoto.fileName;
                      link.click();
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error("Error downloading image:", error);
                      alert("Failed to download image. Please try again.");
                    }
                  }}
                  style={{ cursor: "pointer" }}
                />
                <div className="photo-details">
                  <p>
                    <strong>Uploaded by:</strong>{" "}
                    {selectedPhoto.uploader || "Unknown"}
                  </p>
                  <p>
                    <strong>Date Uploaded:</strong> 📅{" "}
                    {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Title:</strong> {selectedPhoto.title}{" "}
                  </p>
                  <p>
                    <strong>Event:</strong> {selectedPhoto.event}{" "}
                  </p>
                </div>
              </div>

              {/* Download Button Moved Here */}
              <button
                className="download-button"
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `${import.meta.env.VITE_BACKEND_URL}/images/download/${
                        selectedPhoto.fileId
                      }`,
                      {
                        method: "GET",
                        headers: {
                          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
                        },
                      }
                    );
                    if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = selectedPhoto.fileName;
                    link.click();
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Error downloading image:", error);
                    alert("Failed to download image. Please try again.");
                  }
                }}
              >
                ⬇️ Download
              </button>

              <div className="like-container">
                {JSON.parse(localStorage.getItem("user"))?.admin1 && (
                  <button
                    className="disapprove-button"
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          `${
                            import.meta.env.VITE_BACKEND_URL
                          }/approve/disapprove/${selectedPhoto.fileId}`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "X-API-KEY": import.meta.env.VITE_X_API_KEY,
                            },
                          }
                        );
                        if (response.ok) {
                          setSelectedPhoto(null);
                          window.location.reload();
                        }
                      } catch (error) {
                        console.error("Error disapproving image:", error);
                      }
                    }}
                  >
                    Disapprove
                  </button>
                )}
                <button
                  className="like-button"
                  onClick={() => handleLike(selectedPhoto.fileId)}
                >
                  ❤️{" "}
                  {photos.find((p) => p.fileId === selectedPhoto.fileId)
                    .likes || 0}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;
