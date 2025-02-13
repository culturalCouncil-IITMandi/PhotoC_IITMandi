import { useState, useEffect } from "react";
import "./upload.css";

export default function Upload() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [newEvent, setNewEvent] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/filter?approved=true`, {
          headers: {
            "X-API-KEY": import.meta.env.VITE_X_API_KEY,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        const uniqueEvents = [...new Set(data.files.map((file) => file.event).filter(Boolean))];
        setEvents(uniqueEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const imagePreviews = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages(imagePreviews);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      setError("You must be logged in to upload images.");
      return;
    }

    if (images.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    if (isCreatingEvent && !newEvent.trim()) {
      setError("Please enter a name for the new event.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    images.forEach((img) => formData.append("files", img.file));
    formData.append("title", title);
    formData.append("uploaderName", user.name);
    formData.append("userEmail", user.email);
    formData.append("event", isCreatingEvent ? newEvent : selectedEvent);
    formData.append("approved", user.admin1 ? "true" : "false");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/images/upload`, {
        method: "POST",
        headers: {
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      setImages([]);
      setTitle("");
      setSelectedEvent("");
      setNewEvent("");
      setIsCreatingEvent(false);
    } catch (error) {
      console.error("Error uploading:", error);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEventChange = (e) => {
    const value = e.target.value;
    if (value === "create_new") {
      setIsCreatingEvent(true);
      setSelectedEvent("");
    } else {
      setIsCreatingEvent(false);
      setSelectedEvent(value);
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-heading">Upload Images</h1>

      <label className="upload-box">
        {images.length > 0 ? (
          images.map((img, index) => (
            <img key={index} src={img.preview} alt="Uploaded" className="uploaded-image" />
          ))
        ) : (
          <>
            <div className="upload-icon">+</div>
            <p className="upload-text">Drag or drop files</p>
          </>
        )}
        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="upload-input" />
      </label>

      <div className="input-group">
        <label className="input-label">Title</label>
        <input type="text" placeholder="Enter title" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="input-group">
        <label className="input-label">Event</label>
        <select
          className="input-field"
          value={isCreatingEvent ? "create_new" : selectedEvent}
          onChange={handleEventChange}
        >
          <option value="" disabled>Select an event</option>
          {events.map((event) => (
            <option key={event} value={event}>{event}</option>
          ))}
          <option value="create_new">Create New Event</option>
        </select>
      </div>

      {isCreatingEvent && (
        <div className="input-group">
          <label className="input-label">New Event Name</label>
          <input
            type="text"
            placeholder="Enter new event name"
            className="input-field"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
          />
        </div>
      )}

  <button 
    className="submit-button" 
    onClick={handleUpload} 
    disabled={
      images.length === 0// At least 1 file must be uploaded
    }
  >
    {uploading ? "UPLOADING..." : "UPLOAD IMAGES"}
  </button>



      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
