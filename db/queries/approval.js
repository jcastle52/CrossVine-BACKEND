import db from "#db/client";

export async function getApproval(userId, postId) {
  const SQL = `
    SELECT * FROM interactions
    WHERE user_id = $1 AND post_id = $2
    `;
  const {
    rows: [approval],
  } = await db.query(SQL, [userId, postId]);
  return approval;
}

export async function approvePost(userId, postId, userApproval) {
  const SQL = `
    INSERT INTO interactions
    (user_id, post_id, approve)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;
    const {
    rows: [approval],
  } = await db.query(SQL, [userId, postId, userApproval]);
  return approval;
}

export async function deleteApproval(userId, postId) {
  const SQL = `
    DELETE FROM interactions
    WHERE user_id = $1 AND post_id = $2
    `;
    const {
    rows: [approval],
  } = await db.query(SQL, [userId, postId]);
  return approval;
}

export async function updateApproval(userId, postId, userApproval) {
  const SQL = `
    UPDATE interactions
    SET approve = $3
    WHERE user_id = $1 AND post_id = $2
    RETURNING *
    `;
    const {
    rows: [approval],
  } = await db.query(SQL, [userId, postId, userApproval]);
  return approval;
}

export async function likePost(postId, likeValue) {
  const SQL = `
    UPDATE posts
    SET likes = likes + $2
    WHERE id = $1
    RETURNING *
    `;
    const {
    rows: [post],
  } = await db.query(SQL, [postId, likeValue]);
  return post;
}

export async function dislikePost(postId, dislikeValue) {
  const SQL = `
    UPDATE posts
    SET dislikes = dislikes + $2
    WHERE id = $1
    RETURNING *
    `;
    const {
    rows: [post],
  } = await db.query(SQL, [postId, dislikeValue]);
  return post;
}