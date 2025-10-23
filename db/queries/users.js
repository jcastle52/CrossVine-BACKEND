import db from "#db/client";
import bcrypt from "bcrypt";

/* Creates a user from a username and password*/
export async function createUser(username, password, profileName, profileImage, bio) {
  const sql = `
  INSERT INTO users
    (username, password, profile_name, thumbnail_url, bio)
  VALUES
    ($1, $2, $3, $4, $5)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword, profileName, profileImage, bio]);
  return user;
}

/* Used to login using the */
export async function loginUser(username, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getUserById(id, username) {
  const sql = `
  SELECT id, username, profile_name, bio, thumbnail_url, saved_hashtags,
  (
    SELECT json_agg(posts)
    FROM posts
    WHERE user_owner = $2
  ) as posts
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id, username]);
  return user;
}

export async function getUserByUsername(username) {
  const SQL = `
  SELECT username, profile_name, bio, thumbnail_url,
  (
    SELECT json_agg(posts)
    FROM posts
    WHERE user_owner = $1
  ) as posts
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(SQL, [username]);
  return user;
}

export async function updateUser(id, profileName, profileImage, bio) {
  const SQL = `
  UPDATE users
  SET profile_name = $2, thumbnail_url = $3, bio = $4
  WHERE id = $1
  RETURNING username, profile_name, bio, thumbnail_url
  `;
  const {
    rows: [user],
  } = await db.query(SQL, [id, profileName, profileImage, bio]);
  return user;
}