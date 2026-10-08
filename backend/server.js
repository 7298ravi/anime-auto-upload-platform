const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data', 'anime.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    const unique = `${Date.now()}-${base}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(UPLOAD_DIR));

function readAnime() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw || '[]');
}

function writeAnime(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Anime Auto Upload API is running.' });
});

app.get('/api/anime', (_req, res) => {
  const anime = readAnime();
  res.json(anime);
});

app.post('/api/anime', (req, res) => {
  const payload = req.body;

  if (!payload || !payload.title) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  const anime = readAnime();
  const normalized = {
    id: payload.id || Date.now(),
    title: payload.title,
    japaneseTitle: payload.japaneseTitle || '',
    genres: Array.isArray(payload.genres) ? payload.genres : [],
    status: payload.status || 'Ongoing',
    year: payload.year || new Date().getFullYear(),
    episodes: payload.episodes || 12,
    rating: payload.rating || 4.8,
    description: payload.description || '',
    poster: payload.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80',
    trailer: payload.trailer || '',
    createdAt: new Date().toISOString()
  };

  const existingIndex = anime.findIndex((item) => String(item.id) === String(normalized.id));
  if (existingIndex >= 0) {
    anime[existingIndex] = { ...anime[existingIndex], ...normalized };
  } else {
    anime.unshift(normalized);
  }

  writeAnime(anime);
  res.status(201).json({ message: 'Anime saved successfully.', anime: normalized });
});

app.post('/api/upload', upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'trailer', maxCount: 1 }
]), (req, res) => {
  const files = req.files || {};

  const poster = files.poster && files.poster[0]
    ? `/uploads/${files.poster[0].filename}`
    : '';

  const trailer = files.trailer && files.trailer[0]
    ? `/uploads/${files.trailer[0].filename}`
    : '';

  res.json({ poster, trailer });
});

app.listen(PORT, () => {
  console.log(`Anime Auto Upload backend running on http://localhost:${PORT}`);
});
