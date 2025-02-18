import { useState, useEffect } from "react";
import "./upload.css";

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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/filter?approved=true`, {
          headers: { "X-API-KEY": import.meta.env.VITE_X_API_KEY },
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

  // ✅ Handle File Upload
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name, // ✅ Store file name
    }));
    setImages([...images, ...imagePreviews]); // ✅ Allow multiple images
  };

  // ✅ Remove Image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="upload-container">
      <h1 className="upload-heading">Upload Images</h1>

      {/* Upload Box */}
      <label className="upload-box">
        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="upload-input" />
        <div className="upload-text">Drag or drop files</div>
      </label>

      {/* Display Image Previews with Name & Remove Button */}
      <div className="image-preview-container">
        {images.map((img, index) => (
          <div key={index} className="image-preview">
            <img src={img.preview} alt={img.name} className="uploaded-image" />
            <span className="image-name">{img.name}</span>
            <button className="remove-button" onClick={() => removeImage(index)}>❌</button>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <button className="submit-button" onClick={() => {}} disabled={images.length === 0}>
        {uploading ? "UPLOADING..." : "UPLOAD IMAGES"}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
