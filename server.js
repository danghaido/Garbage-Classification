const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// Route để nhận file và gửi đến Flask API
app.post('/api/predict', upload.single('file'), async (req, res) => {
  console.log('Received file:', req.file);  // Log file được gửi lên

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileStream = fs.createReadStream(req.file.path);
  const formData = new FormData();
  formData.append('file', fileStream);

  try {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      console.log('Failed to fetch from Flask server', response.status);
      return res.status(500).json({ error: 'Flask server error' });
    }

    const data = await response.json();
    res.json(data);

    fs.unlinkSync(req.file.path); // Xóa file sau khi gửi
  } catch (err) {
    console.error('Error during API call', err);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.listen(3001, () => {
  console.log('Node server running on http://localhost:3001');
});
