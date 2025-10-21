import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  findHashtag,
  saveHashtag,
  deleteHashtag,
  getUserSavedHashtags,
} from "#db/queries/hastags";

router.use(requireUser);

router
  .route("/")
  .get(async (req, res) => {
    try {
      const hashtags = await getUserSavedHashtags(req.user.id);
      if (!hashtags) return res.status(404).send("Hashtags not found");
      res.status(201).send(hashtags);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .post(requireBody(["hashtag"]), async (req, res) => {
    try {
      const { hashtag } = req.body;

      if (!hashtag.startsWith("#"))
        return res.status(400).send("Hashtag needs to start with #");
      const checkIfExists = await findHashtag(req.user.id, hashtag);
      if (checkIfExists) return res.status(400).send("Hashtag already saved");

      const response = await saveHashtag(req.user.id, hashtag);
      if (!response) return res.status(400).send("Failed to save hashtag");
      res.status(201).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .delete(requireBody(["hashtag"]), async (req, res) => {
    try {
      const { hashtag } = req.body;
      if (!hashtag.startsWith("#"))
        return res.status(400).send("Hashtag needs to start with #");

      const checkIfExists = await findHashtag(req.user.id, hashtag);
      if (!checkIfExists) return res.status(400).send("Hashtag not found");

      const response = await deleteHashtag(req.user.id, hashtag);
      if (!response) return res.status(400).send("Failed to delete hashtag");

      res.status(201).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  });
