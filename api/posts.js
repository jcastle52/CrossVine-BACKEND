import express from "express";
const router = express.Router();
export default router;

import {
  getAllPosts,
  getPostById,
  createPost,
  attachPostToUserId,
} from "#db/queries/posts";

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

router
  .route("/")
  .get(async (req, res) => {
    try {
      const posts = await getAllPosts();
      res.status(201).send(posts);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .post(requireUser, requireBody(["title", "type"]), async (req, res) => {
    try {
      const { title, description, type, url, hashtags } = req.body;
      const allowedTypes = ["Text", "Image", "YouTube"];
      if (!allowedTypes.includes(type))
        return res
          .status(400)
          .send("invalid type. Examples of types: " + allowedTypes);

      let revisedUrl = url;
      if (type === "YouTube") {
        const startSting = "https://www.youtube.com/watch?v=";
        const startSting2 = "https://youtu.be/";
        const attachString = "https://www.youtube.com/embed/";
        if (url.startsWith(startSting, 0)) {
          const vidId = url.substr(32, 11);
          revisedUrl = attachString + vidId;
        } else if (url.startsWith(startSting2, 0)) {
          const vidId = url.substr(17, 11);
          revisedUrl = attachString + vidId;
        } else console.log("no");
      }

      const post = await createPost(
        title,
        description,
        type,
        revisedUrl,
        hashtags
      );
      if (!post) return res.status(401).send("Womp Womp");
      const attachedPost = await attachPostToUserId(req.user.id, post.id);
      res.status(201).send(attachedPost);
    } catch (error) {
      res.status(400).send(error);
    }
  });

router.route("/:id").get(async (req, res) => {
  try {
    const id = req.params.id;
    const post = await getPostById(id);
    if (!post) return res.status(404).send("Post Not Found");
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});
