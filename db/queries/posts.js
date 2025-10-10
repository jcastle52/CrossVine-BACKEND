import db from "#db/client";

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

export async function getAllPosts() {
    const SQL = `
    SELECT * FROM posts
    `;
    const { rows: posts } = await db.query(SQL);
    return posts;
}

export async function createPost(username, title, description, type, url, hashtags) {
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