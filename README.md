# Anime Auto Upload Platform

A modern anime streaming website with an admin panel to upload anime posters, episodes, and metadata automatically to a local backend.

## Features

- Dark neon anime landing page
- Anime catalog with search and genre filters
- Admin upload form for anime metadata and files
- Auto-save to a local JSON database
- Poster and trailer file uploads
- Responsive layout for desktop and mobile
- Ready for extension with real user auth and database integration

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Storage: Local filesystem + JSON metadata
- Uploads: Multer

## Project Structure

```text
anime-auto-upload-platform/
├── backend/
│   ├── data/
│   │   └── anime.json
│   ├── uploads/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
├── .gitignore
├── package.json
├── README.md
└── .github/
```

## Quick Start

1. Install project dependencies:

```bash
npm run install:all
```

2. Start the app:

```bash
npm run dev
```

This will run the backend on `http://localhost:5000` and the frontend on `http://localhost:5173`.

## Admin Upload Flow

- Open the frontend site.
- Fill in the anime title, genres, status, year, episodes, and description.
- Upload a poster image and optional trailer video.
- Click `Add Anime`.
- Data is stored in `backend/data/anime.json` and files are stored in `backend/uploads/`.

## API Endpoints

```text
GET /api/anime
POST /api/anime
GET /api/health
POST /api/upload
```

## Notes

This project is designed to be a strong starter for a real anime streaming platform. You can extend it later with:

- PostgreSQL integration
- JWT auth
- Admin login
- Episode-by-episode pages
- Watchlist and favorites
- Real video streaming server
- Cloud storage upload support
