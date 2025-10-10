DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS interactions;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  profile_name VARCHAR(100),
  bio VARCHAR(500),
  thumbnail_url TEXT DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
  saved_hashtags VARCHAR(100)[]
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_owner VARCHAR(100) NOT NULL REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  post_type VARCHAR(100) NOT NULL,
  post_URL TEXT,
  likes INT DEFAULT 0,
  dislikes INT DEFAULT 0,
  hashtags VARCHAR(100)[],
  post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_owner VARCHAR(100) NOT NULL REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
  post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  comment VARCHAR(500),
  post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interactions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  approve BOOLEAN DEFAULT NULL,
  UNIQUE(user_id, post_id)
);