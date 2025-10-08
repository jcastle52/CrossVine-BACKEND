DROP TABLE IF EXISTS users_posts;
DROP TABLE IF EXISTS interactions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS posts;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  profile_name VARCHAR(30),
  bio VARCHAR(500),
  thumbnail_url TEXT DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
  saved_hashtags VARCHAR(30)[]
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  post_type VARCHAR(25) NOT NULL,
  post_URL TEXT,
  likes INT DEFAULT 0,
  dislikes INT DEFAULT 0,
  hashtags VARCHAR(30)[],
  post_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE users_posts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE (user_id, post_id)
);

CREATE TABLE interactions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  approve BOOLEAN,
  comment VARCHAR(200)
);