import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // ✅ Read filters from URL
import "./gallery.css";

const Gallery = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [events, setEvents] = useState([]);
  const [uploaders, setUploaders] = useState([]);
  const [filters, setFilters] = useState({
    event: queryParams.get("event") || "", // ✅ Auto-set event filter from URL
    uploader: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  // ✅ Apply URL filter automatically when page loads or URL changes
  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      event: queryParams.get("event") || prevFilters.event, 
    }));
  }, [location.search]); // ✅ Runs when the URL changes

  // ✅ Apply filters whenever filters change
  useEffect(() => {
    applyFilters();
  }, [filters]);
  const handleLike = async (photoId) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please log in to like photos.");
      return;
    }
  
    const userId = JSON.parse(storedUser).email;
  
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
  
      // ✅ Update both `photos` and `filteredPhotos`
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.fileId === photoId ? { ...photo, likes: data.likes } : photo
        )
      );
  
      setFilteredPhotos((prevFilteredPhotos) =>
        prevFilteredPhotos.map((photo) =>
          photo.fileId === photoId ? { ...photo, likes: data.likes } : photo
        )
      );
  
      // ✅ If modal is open, update `selectedPhoto`
      setSelectedPhoto((prevPhoto) =>
        prevPhoto && prevPhoto.fileId === photoId ? { ...prevPhoto, likes: data.likes } : prevPhoto
      );
    } catch (error) {
      console.error("Error liking the photo:", error);
    }
  };
  

  const fetchPhotos = async (queryParams = "") => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/filter?approved=true${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (!data.files.length) {
        setPhotos([]);
        setFilteredPhotos([]);
        return;
      }

      setPhotos(data.files);
      setFilteredPhotos(data.files);

      if (events.length === 0 && uploaders.length === 0) {
        const uniqueEvents = [...new Set(data.files.map((photo) => photo.event).filter(Boolean))];
        const uniqueUploaders = [...new Set(data.files.map((photo) => photo.uploader).filter(Boolean))];
        setEvents(uniqueEvents);
        setUploaders(uniqueUploaders);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      setPhotos([]);
      setFilteredPhotos([]);
    }
  };

  const applyFilters = () => {
    let query = "";
    if (filters.event) query += `&event=${encodeURIComponent(filters.event)}`;
    if (filters.uploader) query += `&uploader=${encodeURIComponent(filters.uploader)}`;
    if (filters.startDate) query += `&startDate=${filters.startDate}`;
    if (filters.endDate) query += `&endDate=${filters.endDate}`;

    fetchPhotos(query);
  };

  // ✅ Dynamically update filters on selection
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <>
      {/* ✅ Filter Tab - Now Works Instantly */}
      <div className="filter-tab">
        <select name="event" value={filters.event} onChange={handleFilterChange}>
          <option value="">All Events</option>
          {events.map((event, index) => (
            <option key={index} value={event}>
              {event}
            </option>
          ))}
        </select>

        <select name="uploader" value={filters.uploader} onChange={handleFilterChange}>
          <option value="">All Uploaders</option>
          {uploaders.map((uploader, index) => (
            <option key={index} value={uploader}>
              {uploader}
            </option>
          ))}
        </select>

        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
      </div>

      <div className="photo-grid-container">
        {filteredPhotos.length === 0 ? (
          <p className="no-photos">No photos found</p>
        ) : (
          <div className="photo-grid">
            {filteredPhotos.map((photo) => (
              <div key={photo.fileId} className="photo-card">
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
                  <p className="photo-event">{`Event: ${photo.event}`}</p>
                </div>
                <div className="like-container">
                <button className="like-button" onClick={() => handleLike(photo.fileId)}>
                  ❤️ {photo.likes || 0}
                </button>
              </div>
              </div>
            ))}
          </div>
        )}

        {selectedPhoto && (
          <div className="modal" onClick={() => setSelectedPhoto(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setSelectedPhoto(null)}>
                &times;
              </button>
              <div className="modal-photo-container">
                <img src={selectedPhoto.seaweedUrl} alt={selectedPhoto.fileName} className="modal-photo" />
                <div className="photo-details">
                  <p><strong>Uploaded by:</strong> {selectedPhoto.uploader || "Unknown"}</p>
                  <p><strong>Date Uploaded:</strong> 📅 {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}</p>
                  <p><strong>Title:</strong> {selectedPhoto.title} </p>
                  <p><strong>Event:</strong> {selectedPhoto.event} </p>
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
