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
      if (!userApproval)
        return res.status(200).send(null);
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
      let userApproval;
      const checkIfExists = await getApproval(userId, postId);

      if (!checkIfExists) {
        userApproval = await approvePost(userId, postId, approval)

        if (approval === true) {
          await likePost(postId, 1);
        } else if (approval === false) {
          await dislikePost(postId, 1);
        }

      } else if (approval === checkIfExists.approve) {
        await deleteApproval(userId, postId);
        userApproval = null;
        if (approval === true) {
          await likePost(postId, -1);
        } else if (approval === false) {
          await dislikePost(postId, -1);
        }

      } else {
        userApproval = await updateApproval(userId, postId, approval)

        if (approval === true) {
          await likePost(postId, 1);
          await dislikePost(postId, -1);
        } else if (approval === false) {
          await likePost(postId, -1);
          await dislikePost(postId, 1);
        }
      }

      if (userApproval) {
        userApproval = await getApproval(userId, postId);
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
        await dislikePost(postId, -1);
      }

      res.status(200).send("interaction removed");
    } catch (error) {
      res.status(400).send(error);
    }
  });
