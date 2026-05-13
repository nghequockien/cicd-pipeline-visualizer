import { useRef } from "react";
import "./YamlUploader.css";

export default function YamlUploader({ onUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpload(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onUpload(event.target.result);
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a YAML (.yaml or .yml) file");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="yaml-uploader"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="upload-icon">📁</div>
      <h3>Upload YAML File</h3>
      <p>Drag and drop your YAML file here or click to browse</p>
      <button
        className="upload-button"
        onClick={() => fileInputRef.current?.click()}
      >
        Choose File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".yaml,.yml"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
