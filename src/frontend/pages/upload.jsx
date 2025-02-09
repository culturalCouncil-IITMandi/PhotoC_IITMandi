import { useState, useEffect } from "react";
import "./upload.css";

export default function Upload() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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

    setUploading(true);
    setError(null);

    const formData = new FormData();
    images.forEach((img) => formData.append("files", img.file));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("uploaderName", user.name);
    formData.append("userEmail", user.email);

    // ✅ Auto approve if user is admin
    if (user.admin1) {
      formData.append("approved", "true");
    }
    else {
      formData.append("approved", "false");
    }

    try {
      const response = await fetch("http://localhost:5000/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      setImages([]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error uploading:", error);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-heading">Upload Image</h1>

      {/* Upload Box */}
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

      {/* Title Input */}
      <div className="input-group">
        <label className="input-label">Title</label>
        <input type="text" placeholder="Enter title" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      {/* Description Input */}
      <div className="input-group">
        <label className="input-label">Description</label>
        <textarea placeholder="Enter description" className="textarea-field" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {/* Upload Button */}
      <button className="submit-button" onClick={handleUpload} disabled={uploading}>
        {uploading ? "UPLOADING..." : "UPLOAD IMAGES"}
      </button>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
