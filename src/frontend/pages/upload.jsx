import { useState, useEffect } from "react";
import "./upload.css";
import { toast } from "react-toastify";
import { ErrorToast, SuccessToast } from "../components/Toast";

export default function Upload() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [newEvent, setNewEvent] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/filter?approved=true`,
          {
            headers: { "X-API-KEY": import.meta.env.VITE_X_API_KEY },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        const uniqueEvents = [
          ...new Set(data.files.map((file) => file.event).filter(Boolean)),
        ];
        setEvents(uniqueEvents);
      } catch (error) {
        toast(<ErrorToast message="Failed to fetch events" />);
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Handle File Upload
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages([...images, ...imagePreviews]);
  };

  // ✅ Remove Image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // ✅ Handle Event Selection
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

  // ✅ Handle Upload
  const handleUpload = async () => {
    if (!user) {
      toast(<ErrorToast message="You must be logged in to upload images" />);
      return;
    }
    if (images.length === 0) {
      toast(<ErrorToast message="Please select at least one image" />);
      return;
    }
    if (!title.trim()) {
      toast(<ErrorToast message="Please enter a title for the images" />);
    }
    if (!selectedEvent && !isCreatingEvent) {
      toast(
        <ErrorToast message="Please select an event or create a new one" />
      );
      return;
    }
    if (isCreatingEvent && !newEvent.trim()) {
      toast(<ErrorToast message="Please enter a name for the new event" />);
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
    formData.append("approved", "true");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/images/upload`,
        {
          method: "POST",
          headers: { "X-API-KEY": import.meta.env.VITE_X_API_KEY },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      setImages([]);
      setTitle("");
      setSelectedEvent("");
      setNewEvent("");
      setIsCreatingEvent(false);
      toast(<SuccessToast message="Images uploaded successfully!" />);
    } catch (error) {
      toast(<ErrorToast message="Upload failed. Please try again." />);
      console.error("Error uploading:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-heading">Upload Images</h1>

      {/* Upload Box */}
      <label className="upload-box">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="upload-input"
        />
        <div className="upload-text">Drag or drop files</div>
      </label>

      {/* Display Image Previews with Name & Remove Button */}
      <div className="image-preview-container">
        {images.map((img, index) => (
          <div key={index} className="image-preview">
            <img src={img.preview} alt={img.name} className="uploaded-image" />
            <span className="image-name">{img.name}</span>
            <button
              className="remove-button"
              onClick={() => removeImage(index)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* Title Input */}
      <div className="input-group">
        <label className="input-label">Title</label>
        <input
          type="text"
          placeholder="Enter title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Event Selection */}
      <div className="input-group">
        <label className="input-label">Event</label>
        <select
          className="input-field"
          value={isCreatingEvent ? "create_new" : selectedEvent}
          onChange={handleEventChange}
        >
          <option value="" disabled>
            Select an event
          </option>
          {events.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
          <option value="create_new">Create New Event</option>
        </select>
      </div>

      {/* New Event Name Input (if creating a new event) */}
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

      {/* Upload Button */}
      <button
        className="submit-button"
        onClick={handleUpload}
        // disabled={
        //   images.length === 0 ||
        //   (!selectedEvent && !isCreatingEvent) ||
        //   uploading
        // }
      >
        {uploading ? "UPLOADING..." : "UPLOAD IMAGES"}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
