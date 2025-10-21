import db from "#db/client";

/* Gets a post by id */
export async function getPostById(id) {
  const SQL = `
    SELECT * FROM posts
    WHERE id = $1
    `;
  const {
    rows: [post],
  } = await db.query(SQL, [id]);
  return post;
}

/* Gets all posts */
export async function getAllPosts() {
  const SQL = `
    SELECT * FROM posts
    `;
  const { rows: posts } = await db.query(SQL);
  return posts;
}

/* Creates a post given, username, title, and type. Description, url, hashtags are optional */
export async function createPost(
  username,
  title,
  description,
  type,
  url,
  hashtags
) {
  const SQL = `
    INSERT INTO posts
    (user_owner, title, description, post_type, post_URL, hashtags)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `;
  const {
    rows: [post],
  } = await db.query(SQL, [username, title, description, type, url, hashtags]);
  return post;
}

/* Deletes a post given the postId and the username(gets this from the token)*/
export async function deletePost(postId, username) {
  const SQL = `
  DELETE FROM posts
  WHERE id = $1 AND user_owner = $2
  `;
  const {
    rows: [post],
  } = await db.query(SQL, [postId, username]);
  return post;
}

/* Gets all posts owned by a specific user */
export async function getAllPostsByUsername(username) {
  const SQL = `
    SELECT * FROM posts
    WHERE user_owner = $1
    ORDER BY post_date DESC
    `;
  const { rows: posts } = await db.query(SQL, [username]);
  return posts;
}


