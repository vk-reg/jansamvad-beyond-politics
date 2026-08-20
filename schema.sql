CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Himachal',
  district TEXT NOT NULL DEFAULT 'Statewide',
  image TEXT DEFAULT '',
  video TEXT DEFAULT '',
  source_url TEXT DEFAULT '',
  author TEXT DEFAULT 'जनसंवाद',
  status TEXT NOT NULL DEFAULT 'published',
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_district ON posts(district);
