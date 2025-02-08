import { useState } from "react";
import "./upload.css";

export default function Upload() {
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    
    if (imageFiles.length) {
      const imageNames = imageFiles.map((file) => file.name);
      setImages((prevImages) => [...prevImages, ...imageNames]); // Append new image names
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="upload-container">
      <h1 className="upload-heading">Upload Images</h1>

      {/* Upload Box */}
      <label className="upload-box">
        {images.length > 0 ? (
          <div className="image-preview-container">
            <ul>
              {images.map((name, index) => (
                <li key={index} className="uploaded-image-name">
                  {name} <button onClick={() => removeImage(index)} className="remove-button">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div className="upload-icon">+</div>
            <p className="upload-text">Drag or drop files</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="upload-input"
        />
      </label>

      {/* Title Input */}
      <div className="input-group">
        <label className="input-label">Title</label>
        <input type="text" placeholder="Enter title" className="input-field" />
      </div>

      {/* Description Input */}
      <div className="input-group">
        <label className="input-label">Description</label>
        <textarea
          placeholder="Enter description"
          className="textarea-field"
        ></textarea>
      </div>

      {/* Upload Button */}
      <button className="submit-button">UPLOAD IMAGES</button>
    </div>
  );
}
