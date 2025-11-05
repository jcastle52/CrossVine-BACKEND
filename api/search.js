import express from "express";
const router = express.Router();
export default router;

import { searchRequest } from "#db/queries/search";

router
    .route("/")
    .post(async (req, res) => {
        try {
            const { date, approval, type, search } = req.body;
            const posts = await searchRequest(date, approval, type, search);
            res.status(200).send(posts);
        } catch (error) {
            res.status(400).send(error);
        }
    })