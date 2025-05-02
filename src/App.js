import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState({ prediction: "", confidence: "" });
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult({ prediction: "", confidence: "" }); // Reset kết quả cũ
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Vui lòng chọn một tệp ảnh.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3001/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Không thể kết nối đến máy chủ.');
      }

      const data = await res.json();
      setResult(data);
      setError('');
    } catch (err) {
      console.error('Lỗi khi gọi API', err);
      setError('Lỗi khi dự đoán');
    }
  };

  return (
    <div className="App">
      <h2>🌍 Hệ thống phân loại rác thải thông minh</h2>

    <div className="file-upload">
      <label htmlFor="upload" className="upload-btn">📁 Chọn ảnh</label>
      <input
        id="upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {file && <span className="file-name">{file.name}</span>}
    </div>

      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}

      <button onClick={handleSubmit} className="submit-btn">🔍 Dự đoán</button>

      {error && <p className="error-text">⚠️ {error}</p>}

      {result.prediction && (
        <div className="result-box">
          <h3>Kết quả dự đoán</h3>
          <p><strong>Loại rác:</strong> {result.prediction}</p>
          <p><strong>Độ chính xác:</strong> {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
