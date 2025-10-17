import db from "#db/client";
import bcrypt from "bcrypt";

/* Creates a user from a username and password*/
export async function createUser(username, password, fullname, profileImage, bio) {
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
  } = await db.query(sql, [username, hashedPassword, fullname, profileImage, bio]);
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

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

export async function getUserByUsername(username) {
  const SQL = `
  SELECT username, profile_name, bio, thumbnail_url
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(SQL, [username]);
  return user;
}

export async function getUserSavedHashtags(id) {
  const SQL = `
  SELECT saved_hashtags
  FROM users
  WHERE id = $1
  `;
  const { rows: [hashtags] } = await db.query(SQL, [id]);
  return hashtags.saved_hashtags;
}

export async function saveHashtag(id, hashtag) {
  const SQL = `
  UPDATE users
  SET saved_hashtags = ARRAY_APPEND(saved_hashtags, $2)
  WHERE id = $1
  RETURNING saved_hashtags
  `;
  const {
    rows: [tags],
  } = await db.query(SQL, [id, hashtag]);
  return tags.saved_hashtags;
}

export async function findHashtag(id, hashtag) {
  const SQL = `
  SELECT saved_hashtags
  FROM users
  WHERE id = $1 AND $2 = ANY(saved_hashtags)
  `;
  const {
    rows: [tag],
  } = await db.query(SQL, [id, hashtag]);
  return tag;
}
