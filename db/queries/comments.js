import db from "#db/client";

export async function getComment(commentId) {
  const SQL = `
    SELECT * FROM comments
    WHERE id = $1
    `;
  const {
    rows: [comments],
  } = await db.query(SQL, [commentId]);
  return comments;
}

export async function getComments(postId) {
  const SQL = `
    SELECT * FROM comments
    WHERE post_id = $1
    ORDER BY post_date DESC
    `;
  const { rows: comments } = await db.query(SQL, [postId]);
  return comments;
}

export async function getUserComments(username, postId) {
  const SQL = `
    SELECT * FROM comments
    WHERE user_owner = $1 AND post_id = $2
    ORDER BY post_date DESC
    `;
  const { rows: comments } = await db.query(SQL, [username, postId]);
  return comments;
}

export async function createComment(username, postId, userComment) {
  const SQL = `
    INSERT INTO comments
    (user_owner, post_id, comment)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [comment],
  } = await db.query(SQL, [username, postId, userComment]);
  return comment;
}

export async function deleteComment(commentId, username) {
    const SQL = `
    DELETE FROM comments
    WHERE id = $1 AND user_owner = $2
    `;
    const {
    rows: [comment],
  } = await db.query(SQL, [commentId, username]);
  return comment;
}

// CREATE TABLE comments (
//   id SERIAL PRIMARY KEY,
//   user_owner VARCHAR(100) NOT NULL REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
//   post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
//   comment VARCHAR(500),
//   post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
