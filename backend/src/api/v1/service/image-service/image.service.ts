import { Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { env } from "../../config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

// Configure multer with memory storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
    }
  },
});

class ImageService {
  public uploadImage = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Convert buffer to stream for Cloudinary upload
      return new Promise<void>((resolve) => {
        const buffer = req.file!.buffer;
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "cinebase",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [{ width: 500, height: 750, crop: "fill" }],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              res.status(500).json({ error: "Failed to upload image" });
              resolve();
              return;
            }

            if (result) {
              res.status(200).json({
                url: result.secure_url,
                publicId: result.public_id,
              });
              resolve();
            }
          }
        );

        // Pipe buffer to stream
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(stream);
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  };

  public deleteImage = async (req: Request, res: Response) => {
    try {
      const { publicId } = req.params;
      const result = await cloudinary.uploader.destroy(publicId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  };
}

export const imageService = new ImageService();
