// src/ImageUploader.js
import React, { useState } from "react";
import axios from "axios";

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("https://cnn-backend-hh6c.onrender.com/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      setResult({ error: "Failed to get prediction" });
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={!image} className="ml-2">
        Upload
      </button>
      {result && (
        <div className="mt-4">
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
