import express from "express";
import { authService } from "../service/auth-service/auth.service";
import { imageService, upload } from "../service/image-service/image.service";

const router = express.Router();

// Single image upload
router.post("/image", authService.authenticate, upload.single("image"), imageService.uploadImage);

// Delete by publicId
router.delete("/image/:publicId", authService.authenticate, imageService.deleteImage);

export default router;


