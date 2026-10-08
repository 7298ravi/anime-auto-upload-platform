# Anime Auto Upload Platform

A modern anime streaming platform starter built with a Node.js + Express backend and a Vite + React frontend.

## Features

- Modern dark anime landing page
- Search and genre filtering
- Anime catalog cards with poster and metadata
- Admin upload form for anime entries
- File upload support for posters and trailers
- Data stored in a local JSON database
- Easy local development with one command

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express, Multer
- Data storage: local JSON file

## Project structure

```text
anime-auto-upload-platform/
├── backend/
│   ├── data/
│   │   └── anime.json
│   ├── uploads/
│   │   └── .gitkeep
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── .gitignore
├── package.json
├── README.md
└── .github/
```

## Quick start

```bash
npm install
npm run install:all
npm run dev
```

Then:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Admin usage

1. Open the site in the browser.
2. Use the "Admin Upload" form.
3. Fill in the anime title, genres, year, status, episodes, and description.
4. Upload a poster and optional trailer.
5. Click "Add Anime".

The data is saved into `backend/data/anime.json` and files are saved in `backend/uploads/`.

## API endpoints

```text
GET /api/health
GET /api/anime
POST /api/anime
POST /api/upload
```
