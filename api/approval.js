import express from "express";
const router = express.Router();
export default router;

import {
  getApproval,
  approvePost,
  deleteApproval,
  updateApproval,
  likePost,
  dislikePost,
} from "#db/queries/approval";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router.use(requireUser);

router
  .route("/:postId")
  .get(async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.user.id;
      const userApproval = await getApproval(userId, postId);
      if (!userApproval) return res.status(404).send("Could not find interaction");
      res.status(200).send(userApproval);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .post(requireBody(["approval"]), async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.user.id;
      const { approval } = req.body;
        if (!typeof approval === "boolean" || approval !== true && approval !== false) return res.status(400).send("Approval must be true or false");
      const checkIfExists = await getApproval(userId, postId);
      if (checkIfExists)
        return res
          .status(400)
          .send("interaction already exists. Try updating it");
      const userApproval = await approvePost(userId, postId, approval);
      if (!userApproval) return res.status(400).send("Could not approve post");

      if (approval === true) {
        await likePost(postId, 1);
      } else {
        await dislikePost(postId, 1);
      }

      res.status(201).send(userApproval);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .put(requireBody(["approval"]), async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.user.id;
      const { approval } = req.body;
      if (!typeof approval === "boolean" || approval !== true && approval !== false) return res.status(400).send("Approval must be true or false");
      const checkIfExists = await getApproval(userId, postId);
      if (!checkIfExists)
        return res
          .status(404)
          .send("interaction does not exists, try creating it");

          if (approval === checkIfExists.approve) return res.status(400).send(`User already approved as ${approval}`);
      const userApproval = await updateApproval(userId, postId, approval);
      if (!userApproval)
        return res.status(400).send("Could not update approval");

    if (approval === true) {
        await likePost(postId, 1);
        await dislikePost(postId, -1);
      } else {
        await dislikePost(postId, 1);
        await likePost(postId, -1);
      }

      res.status(201).send(userApproval);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.user.id;
      const checkIfExists = await getApproval(userId, postId);
      if (!checkIfExists)
        return res.status(404).send("interaction does not exists");
      await deleteApproval(userId, postId);
        if (checkIfExists.approve === true) {
            await likePost(postId, -1);
        } else {
            await dislikePost(postId,-1);
        }

      res.status(200).send("interaction removed");
    } catch (error) {
      res.status(400).send(error);
    }
  });
