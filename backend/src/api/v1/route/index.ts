import express from "express";

import authRouter from "./auth-route";
import moviesRouter from "./movie-route";
import uploadRouter from "./upload-route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/movies", moviesRouter);
router.use("/upload", uploadRouter);

export default router;
