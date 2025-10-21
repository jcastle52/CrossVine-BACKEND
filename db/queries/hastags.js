import db from "#db/client";

export async function getUserSavedHashtags(id) {
  const SQL = `
  SELECT saved_hashtags
  FROM users
  WHERE id = $1
  `;
  const { rows: [tags] } = await db.query(SQL, [id]);
  return tags.saved_hashtags;
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

export async function deleteHashtag(id, hashtag) {
  const SQL = `
  UPDATE users
  SET saved_hashtags = ARRAY_REMOVE(saved_hashtags, $2)
  WHERE id = $1
  RETURNING saved_hashtags
  `;
  const { rows: [tags] } = await db.query(SQL, [id, hashtag]);
  return tags.saved_hashtags;
}