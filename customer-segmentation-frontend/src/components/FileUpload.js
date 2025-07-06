import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ setResults }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setResults(res.data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong!");
    }
    setUploading(false);
  };

  const handleDownload = async () => {
    if (!file) return alert("Upload a file first to generate a report!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/download-report", formData, {
        responseType: 'blob', // Important to get file as binary
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'segment_summary.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed!");
    }
  };


  return (
    <div className="p-4">
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button style={{ marginRight: '10px' }} onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload CSV"}
      </button>
      <button onClick={handleDownload} disabled={!file}>
        Download Report CSV
      </button>
    </div>
  );
};

export default FileUpload;
