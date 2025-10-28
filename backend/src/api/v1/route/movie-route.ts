import express from "express";
import { movieService } from "../service/movie-service/movie.service";
import { authService } from "../service/auth-service/auth.service";
import { movieCreationLimiter } from "../service/rate-limit-service/rate-limit.service";

const router = express.Router();

// Apply rate limiter only to POST (create) endpoint
router.post("/", movieCreationLimiter, authService.authenticate, movieService.createEntry);
router.get("/", authService.authenticate, movieService.getAllEntries);
router.get("/:id", authService.authenticate, movieService.getEntryById);
router.put("/:id", authService.authenticate, movieService.updateEntry);
router.delete("/:id", authService.authenticate, movieService.deleteEntry);

export default router;
