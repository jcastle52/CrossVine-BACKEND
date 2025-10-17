import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  loginUser,
  getUserByUsername,
  getUserSavedHashtags,
  saveHashtag,
  findHashtag,
  getUserById,
} from "#db/queries/users";
import { getAllPostsByUsername } from "#db/queries/posts";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    try {
      const { username, password, fullname, profileImage, bio } = req.body;
      let imageURl; 
      const checkUser = await getUserByUsername(username);
      if (checkUser) return res.status(400).send("Username already taken");

      console.log(profileImage);
      if (!profileImage) imageURl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
      console.log(profileImage);
      const user = await createUser(
        username,
        password,
        fullname,
        imageURl,
        bio
      );

      const token = await createToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      res.status(400).send(error);
    }
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    try {
      const { username, password } = req.body;

      const checkUser = await getUserByUsername(username);
      if (!checkUser) return res.status(404).send("No account found");

      const user = await loginUser(username, password);
      if (!user) return res.status(401).send("Invalid username or password");

      const token = await createToken({ id: user.id });
      res.send(token);
    } catch (error) {
      res.status(400).send(error);
    }
  });

router.route("/user").get(requireUser, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router
  .route("/saved")
  .get(requireUser, async (req, res) => {
    try {
      const hashtags = await getUserSavedHashtags(req.user.id);
      if (!hashtags) return res.status(404).send("Hashtags not found");
      res.status(201).send(hashtags);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .post(requireUser, requireBody(["hashtag"]), async (req, res) => {
    try {
      const { hashtag } = req.body;

      if (!hashtag.startsWith("#"))
        return res.status(400).send("Hashtag needs to start with #");
      const checkIfExists = await findHashtag(req.user.id, hashtag);
      if (checkIfExists) return res.status(400).send("Hashtag already saved");

      const response = await saveHashtag(req.user.id, hashtag);
      console.log("test");
      if (!response) return res.status(400).send("Failed to save hashtag");
      res.status(201).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  });

router.route("/:username").get(async (req, res) => {
  try {
    const username = req.params.username;

    const user = await getUserByUsername(username);
    if (!user) res.status(404).send("User not found");
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route("/:username/posts").get(async (req, res) => {
  try {
    const username = req.params.username;

    const user = await getUserByUsername(username);
    if (!user) res.status(404).send("User not found");

    const posts = await getAllPostsByUsername(username);
    if (!posts || posts.length === 0)
      return res.status(404).send("No posts were found");
    res.status(200).send(posts);
  } catch (error) {
    res.status(400).send(error);
  }
});
