// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData);
      setResults(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDownload = async () => {
    if (!file) return alert("Please upload a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/download-report", formData, {
        responseType: 'blob',
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
    <div className="min-h-screen  bg-gray-100 ">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl ">
        <h1 className="text-3xl font-bold mb-6 text-center">Customer Segmentation Dashboard</h1>

        <div className="flex flex-col items-center space-y-4">
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <div className="space-x-4">
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
            <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">Download Report CSV</button>
          </div>
        </div>

        {results && <ResultsDisplay results={results} />}
      </div>
    </div>

  );
}

export default App;
