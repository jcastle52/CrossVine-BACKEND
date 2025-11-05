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
      if (!hashtags) return res.status(404).send({error: "No hashtags found"});
      res.status(200).send(hashtags);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .post(requireBody(["hashtag"]), async (req, res) => {
    try {
      const { hashtag } = req.body;

      if (!hashtag.startsWith("#"))
        return res.status(400).send({error: "Hashtag needs to start with #"});
      const checkIfExists = await findHashtag(req.user.id, hashtag);
      if (checkIfExists) return res.status(400).send({error: "Hashtag already saved"});

      const response = await saveHashtag(req.user.id, hashtag);
      if (!response) return res.status(400).send({error: "Failed to save hashtag"});
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .delete(requireBody(["hashtag"]), async (req, res) => {
    try {
      const { hashtag } = req.body;
      if (!hashtag.startsWith("#"))
        return res.status(400).send({error: "Hashtag needs to start with #"});

      const checkIfExists = await findHashtag(req.user.id, hashtag);
      if (!checkIfExists) return res.status(400).send({error: "Hashtag not found"});

      const response = await deleteHashtag(req.user.id, hashtag);
      if (!response) return res.status(400).send({error: "Failed to delete hashtag"});

      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  });
