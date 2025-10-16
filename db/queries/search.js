import db from "#db/client";

/* gets posts based off of a search string. 
Each word in the string is search for in all posts title's.
data, type, approval are extra filters.
*/
export async function searchRequest(date, approval, type, search) {
  let sqlOrderString = "";
  let sqlTypeString = "";
  let sqlSearchString = "";
  const searchArr = search.split(" ");

  for (let i = 0; i < searchArr.length; i++) {
    if (searchArr[i].startsWith("#")) {
      sqlSearchString = sqlSearchString + `'${searchArr[i]}' = ANY(hashtags)`;
    } else {
      sqlSearchString = sqlSearchString + `title ILIKE '%${searchArr[i]}%'`;
    }
    if (i + 1 < searchArr.length) {
      sqlSearchString = sqlSearchString + " OR ";
    }
  }

  if (type) {
    sqlTypeString = ` AND post_type = '${type}'`;
  }

  if (date && approval) {
    if (date === "Newest") {
      sqlOrderString = sqlOrderString + "ORDER BY post_date DESC";
    } else if (date === "Oldest") {
      sqlOrderString = sqlOrderString + "ORDER BY post_date ASC";
    }

    if (approval === "Likes") {
      sqlOrderString = sqlOrderString + ", likes ASC";
    } else if (approval === "Dislikes") {
      sqlOrderString = sqlOrderString + ", dislikes ASC";
    }
  } else if (date) {
    if (date === "Newest") {
      sqlOrderString = sqlOrderString + "ORDER BY post_date DESC";
    } else if (date === "Oldest") {
      sqlOrderString = sqlOrderString + "ORDER BY post_date ASC";
    }
  } else if (approval) {
    if (approval === "Likes") {
      sqlOrderString = sqlOrderString + "ORDER BY likes ASC";
    } else if (approval === "Dislikes") {
      sqlOrderString = sqlOrderString + "ORDER BY dislikes ASC";
    }
  }
  const SQL = `
    SELECT * FROM posts
    WHERE ${sqlSearchString} ${sqlTypeString}
    ${sqlOrderString}
    `;

  const { rows: posts } = await db.query(SQL);
  return posts;
}
