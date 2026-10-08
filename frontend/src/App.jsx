import { useEffect, useMemo, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    japaneseTitle: '',
    genres: '',
    status: 'Ongoing',
    year: new Date().getFullYear(),
    episodes: 12,
    rating: 4.8,
    description: '',
    poster: '',
    trailer: ''
  });

  async function fetchAnime() {
    try {
      const res = await fetch(`${API_URL}/anime`);
      const data = await res.json();
      setAnimeList(data);
    } catch (error) {
      console.error(error);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnime();
  }, []);

  const allGenres = useMemo(() => {
    const genreSet = new Set();
    animeList.forEach((item) => {
      (item.genres || []).forEach((genre) => genreSet.add(genre));
    });
    return ['All', ...Array.from(genreSet)];
  }, [animeList]);

  const filteredAnime = useMemo(() => {
    return animeList.filter((item) => {
      const text = `${item.title} ${item.description} ${(item.genres || []).join(' ')}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesGenre = activeGenre === 'All' || (item.genres || []).includes(activeGenre);
      return matchesSearch && matchesGenre;
    });
  }, [animeList, search, activeGenre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const fieldName = event.target.name;

    if (!file) return;

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setForm((prev) => ({ ...prev, [fieldName]: data[fieldName] || '' }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      genres: form.genres
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean)
    };

    try {
      const res = await fetch(`${API_URL}/anime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setMessage(data.message || 'Anime saved successfully.');
      setForm({
        title: '',
        japaneseTitle: '',
        genres: '',
        status: 'Ongoing',
        year: new Date().getFullYear(),
        episodes: 12,
        rating: 4.8,
        description: '',
        poster: '',
        trailer: ''
      });
      fetchAnime();
    } catch (error) {
      console.error(error);
      setMessage('Failed to save anime.');
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav">
          <div className="brand">
            <span className="brand-mark">A</span>
            <span>AniVerse</span>
          </div>

          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">Trending</a>
            <a href="#">Genres</a>
            <a href="#">My List</a>
          </nav>

          <div className="nav-actions">
            <button className="ghost-button">Sign In</button>
            <button className="primary-button">Join Now</button>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero section-gap">
          <div className="hero-copy">
            <span className="eyebrow">🔥 Auto Uploading Anime Portal</span>
            <h1>
              Discover your <span className="gradient-text">next obsession</span>
            </h1>
            <p>
              Explore trending anime, uncover unforgettable stories, and manage a premium anime catalog from one beautiful platform.
            </p>

            <div className="cta-row">
              <button className="primary-button large">Watch Now</button>
              <button className="secondary-button large">Browse Catalog</button>
            </div>

            <div className="stats-row">
              <div className="stat-box">
                <strong>120K+</strong>
                <span>Viewers</span>
              </div>
              <div className="stat-box">
                <strong>4.9/5</strong>
                <span>Rating</span>
              </div>
              <div className="stat-box">
                <strong>24/7</strong>
                <span>Stream</span>
              </div>
            </div>
          </div>

          <div className="hero-art-wrap">
            <div className="hero-poster">
              <div className="overlay-content">
                <span className="featured-tag">Featured</span>
                <h3>Akira Rises</h3>
                <div className="meta-row">
                  <span>Action</span>
                  <span className="dot" />
                  <span>Drama</span>
                  <span className="dot" />
                  <span>12 Episodes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-gap">
          <div className="section-heading">
            <h2>Popular Now</h2>
            <a href="#">View all</a>
          </div>

          <div className="search-row">
            <input
              type="text"
              placeholder="Search anime, genre, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-row">
            {allGenres.map((genre) => (
              <button
                key={genre}
                className={activeGenre === genre ? 'filter-pill active' : 'filter-pill'}
                onClick={() => setActiveGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="empty-state">Loading anime catalog...</p>
          ) : (
            <div className="card-grid">
              {filteredAnime.length > 0 ? (
                filteredAnime.map((item) => (
                  <article className="anime-card" key={item.id}>
                    <div
                      className="anime-poster"
                      style={{ backgroundImage: `url(${item.poster})` }}
                    />
                    <div className="anime-body">
                      <span className="anime-tag">{(item.genres || [])[0] || 'Anime'}</span>
                      <h3>{item.title}</h3>
                      <div className="anime-meta">
                        <span>{item.episodes} ep</span>
                        <span className="rating">{item.rating}</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p className="empty-state">No anime found for this search.</p>
              )}
            </div>
          )}
        </section>

        <section className="section-gap admin-panel">
          <div className="section-heading">
            <h2>Admin Upload</h2>
          </div>

          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Title
                <input name="title" value={form.title} onChange={handleChange} required />
              </label>

              <label>
                Japanese Title
                <input name="japaneseTitle" value={form.japaneseTitle} onChange={handleChange} />
              </label>

              <label>
                Genres
                <input name="genres" value={form.genres} onChange={handleChange} placeholder="Action, Fantasy" />
              </label>

              <label>
                Status
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </label>

              <label>
                Year
                <input type="number" name="year" value={form.year} onChange={handleChange} />
              </label>

              <label>
                Episodes
                <input type="number" name="episodes" value={form.episodes} onChange={handleChange} />
              </label>

              <label>
                Rating
                <input type="number" step="0.1" min="0" max="5" name="rating" value={form.rating} onChange={handleChange} />
              </label>

              <label className="upload-field">
                Poster Upload
                <input type="file" name="poster" accept="image/*" onChange={handleUpload} />
              </label>

              <label className="upload-field">
                Trailer Upload
                <input type="file" name="trailer" accept="video/*" onChange={handleUpload} />
              </label>
            </div>

            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} rows="5" />
            </label>

            {message && <p className="form-message">{message}</p>}

            <div className="submit-row">
              <button type="submit" className="primary-button large">Add Anime</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
