import express from "express";
const router = express.Router();
export default router;

import {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
} from "#db/queries/posts";

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import handleUrl from "#api/functions/handleUrl";

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
      if (!allowedTypes.includes(type)) return res.status(400).send("invalid type. Examples of types: " + allowedTypes);

      const checkUrl = handleUrl(type, url);
      if (checkUrl.error) return res.status(400).send(checkUrl.error);

      const post = await createPost(
        req.user.username,
        title,
        description,
        type,
        checkUrl.revisedUrl,
        hashtags
      );
      if (!post) return res.status(401).send("Womp Womp");
      res.status(201).send(post);
    } catch (error) {
      res.status(400).send(error);
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const post = await getPostById(id);
      if (!post) return res.status(404).send("Post Does Not Exist");
      res.status(201).send(post);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .delete(requireUser, async (req, res) => {
    try {
      const id = req.params.id;
      const post = await getPostById(id);
      if (!post) return res.status(404).send("Post Does Not Exist");
      if (post.user_owner !== req.user.username) return res.status(401).send("You Do Not Own This Post");

      await deletePost(id, req.user.username);
      res.status(201).send("Post Deleted");
    } catch (error) {
      res.status(400).send(error);
    }
  });
