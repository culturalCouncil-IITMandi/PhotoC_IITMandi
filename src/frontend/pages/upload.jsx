import { useState } from "react";
import "./upload.css";

export default function Upload() {
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file); // Debugging
      setImage(URL.createObjectURL(file)); // Generate preview
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-heading">Upload Image</h1>

      {/* Upload Box */}
      <label className="upload-box">
        {image ? (
          <img src={image} alt="Uploaded" className="uploaded-image" />
        ) : (
          <>
            <div className="upload-icon">+</div>
            <p className="upload-text">Drag or drop files</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
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
