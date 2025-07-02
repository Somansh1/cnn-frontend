import React, { useState } from "react";
import axios from "axios";
import { CloudUpload } from "lucide-react"; // Optional icon package

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);

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
      setResult({ error: "Failed to get prediction" });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setImage(e.dataTransfer.files[0]);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('/apple_bg.jpg')`, 
      }}
    >
      <div
        className={`bg-white/30 backdrop-blur-md p-8 rounded-xl border-2 border-dashed ${
          dragging ? "border-green-400" : "border-white"
        } w-full max-w-md text-center transition`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
      >
        <CloudUpload className="mx-auto mb-4 w-12 h-12 text-white" />
        <p className="text-white text-lg mb-4">
          Drag and drop an image of a potato plant leaf to process
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4 block mx-auto text-white"
        />

        <button
          onClick={handleUpload}
          disabled={!image}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-full disabled:opacity-50"
        >
          Upload
        </button>

        {result && (
          <div className="mt-6 bg-white/80 p-4 rounded-xl text-black">
            <h2 className="font-semibold mb-2">Prediction Result:</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;
