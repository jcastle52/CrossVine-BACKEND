import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  loginUser,
  getUserByUsername,
  getUserById,
  updateUser
} from "#db/queries/users";
import { getAllPostsByUsername } from "#db/queries/posts";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    try {
      const { username, password, profileName, profileImage, bio } = req.body;
      const checkUser = await getUserByUsername(username);
      if (checkUser) return res.status(400).send("Username already taken");

      const user = await createUser(
        username,
        password,
        profileName,
        profileImage,
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

router.route("/profile")
.get(requireUser, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
})
.put(requireUser, async (req, res) => {
  try {
    const { profileName, profileImage, bio } = req.body;
    const response = await updateUser(req.user.id, profileName, profileImage, bio);
    if (!response) return res.status(400).send("something went wrong");
    res.status(200).send(response);
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
