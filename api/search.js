import express from "express";
const router = express.Router();
export default router;

import { searchRequest } from "#db/queries/search";
import requireBody from "#middleware/requireBody";

router
    .route("/")
    .post(requireBody(["search"]), async (req, res) => {
        try {
            const { date, approval, type, search } = req.body;
            const posts = await searchRequest(date, approval, type, search);
            res.status(201).send(posts);
        } catch (error) {
            res.status(400).send(error);
        }
    })