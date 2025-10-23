import express from "express";
const router = express.Router();
export default router;

import {
  createComment,
  getComments,
  getUserComments,
  getComment,
  deleteComment,
} from "#db/queries/comments";

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

router
  .route("/posts/:postId")
  .get(async (req, res) => {
    try {
      const postId = req.params.postId;
      const comments = await getComments(postId);
      if (!comments) return res.status(400).send("no comments exist");
      res.status(200).send(comments);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .post(requireUser, requireBody(["comment"]), async (req, res) => {
    try {
      const username = req.user.username;
      const postId = req.params.postId;
      const { comment } = req.body;
      const response = await createComment(username, postId, comment);
      if (!response) return res.status(400).send("something went wrong");
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  });

router
  .route("/posts/:postId/user")
  .get(requireUser, async (req, res) => {
    try {
      const postId = req.params.postId;
      const username = req.user.username;
      const comments = await getUserComments(username, postId);
      if (!comments) return res.status(400).send("no comments exist");
      res.status(200).send(comments);
    } catch (error) {
      res.status(400).send(error);
    }
  })

router.route("/:id").get(async (req, res) => {
  try {
    const id = req.params.id;
    const response = await getComment(id);
    if (!response) return res.status(400).send("something went wrong");
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error);
  }
})
.delete(requireUser, async (req, res) => {
    try {
    const id = req.params.id;
    const username = req.user.username
    await deleteComment(id, username);
    res.status(200).send("deleted");
  } catch (error) {
    res.status(400).send(error);
  }
});
