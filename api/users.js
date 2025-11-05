import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  loginUser,
  getUserByUsername,
  getUserById,
  updateUser,
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    try {
      const { username, password, profileName, profileImage, bio } = req.body;

      if (username.length > 25)
        return res
          .status(400)
          .res({ error: "Username must be less than 25 characters long" });
      if (password.length > 25)
        return res
          .status(400)
          .res({ error: "Password must be less than 25 characters long" });
      if (profileName.length > 30)
        return res
          .status(400)
          .res({ error: "Username must be less than 30 characters long" });
      if (bio.length > 500)
        return res
          .status(400)
          .res({ error: "Bio must be less than 500 characters long" });

      const checkUser = await getUserByUsername(username);
      if (checkUser)
        return res.status(400).send({ error: "Username already taken" });

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
      if (!checkUser)
        return res.status(400).send({ error: "Invalid credentials" });

      const user = await loginUser(username, password);
      if (!user) return res.status(400).send({ error: "Invalid credentials" });

      const token = await createToken({ id: user.id });
      res.send(token);
    } catch (error) {
      res.status(400).send(error);
    }
  });

router
  .route("/profile")
  .get(requireUser, async (req, res) => {
    try {
      const user = await getUserById(req.user.id, req.user.username);
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .put(
    requireUser,
    requireBody(["profileName", "profileImage", "bio"]),
    async (req, res) => {
      try {
        const { profileName, profileImage, bio } = req.body;

        if (profileName.length > 30)
          return res
            .status(400)
            .res({ error: "Username must be less than 30 characters long" });
        if (bio.length > 500)
          return res
            .status(400)
            .res({ error: "Bio must be less than 500 characters long" });

        const response = await updateUser(
          req.user.id,
          profileName,
          profileImage,
          bio
        );
        if (!response) return res.status(400).send({error: "Could not update profile"});
        res.status(200).send(response);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  );

router.route("/:username").get(async (req, res) => {
  try {
    const username = req.params.username;

    const user = await getUserByUsername(username);
    if (!user) res.status(404).send({error: "User not found"});
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
