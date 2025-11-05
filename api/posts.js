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
      if (!allowedTypes.includes(type)) return res.status(400).send({error: "invalid type. Examples of types: " + allowedTypes});

      const checkUrl = handleUrl(type, url);
      if (checkUrl.error) return res.status(400).send({error: checkUrl.error});

      if (type === "Text" && !description) return res.status(400).send({error: "Text posts need a description"});
     
      if (hashtags && hashtags.length > 0) {
        if (hashtags.length > 5) return res.status(400).send({error: "Maximum 5 hashtags per post"})

        for (const hashtag of hashtags) {
          if (!hashtag.startsWith("#"))
        return res.status(400).send({error: "Hashtags need to start with #"});
        }
      }

      const post = await createPost(
        req.user.username,
        title,
        description,
        type,
        checkUrl.revisedUrl,
        hashtags
      );

      if (!post) return res.status(400).send({error: "Could not create post"});
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
      if (!post) return res.status(404).send({error: "Post does not exist"});
      res.status(201).send(post);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .delete(requireUser, async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await getPostById(postId);
      if (!post) return res.status(404).send({error: "Post does not exist"});
      if (post.user_owner !== req.user.username) return res.status(403).send({error: "You do not own this Post"});

      await deletePost(postId, req.user.username);
      res.status(204).send("Post Deleted");
    } catch (error) {
      res.status(400).send(error);
    }
  });
