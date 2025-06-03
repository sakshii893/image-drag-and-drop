import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compression, setCompression] = useState("medium");
  const [result, setResult] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null); // reset previous result
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("compression", compression);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Compression failed.");
    }
  };

  return (
    <div className="App">
      <h1>🖼️ Image Compressor</h1>

      <div
        className="drop-area"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt="Selected" />
        ) : (
          <p>Drag & drop an image or click to select</p>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div className="controls">
        <label>Compression:</label>
        <select
          value={compression}
          onChange={(e) => setCompression(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button onClick={handleUpload}>Compress</button>
      </div>

      {result && (
        <div className="results">
          <h2>📊 Compression Results</h2>
          <p>Original Size: {(result.originalSize / 1024).toFixed(2)} KB</p>
          <p>Compressed Size: {(result.compressedSize / 1024).toFixed(2)} KB</p>
          <img
            src={result.compressedImage}
            alt="Compressed"
            style={{ maxWidth: "300px", marginTop: "10px" }}
          />
          <a
  href={result.compressedImage}
  download="compressed-image.jpg"
  className="download-btn"
>
  Download Compressed Image
</a>

        </div>
      )}
    </div>
  );
}

export default App;
