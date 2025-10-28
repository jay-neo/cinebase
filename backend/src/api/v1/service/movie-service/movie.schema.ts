import { z } from "zod";

export const createEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z
    .enum(["Movie", "TV Show"])
    .refine((val) => ["Movie", "TV Show"].includes(val), {
      message: "Type must be either Movie or TV Show",
    }),
  director: z.string().min(1, "Director is required"),
  budget: z.number().min(0).optional(),
  location: z.string().min(1, "Location is required"),
  duration: z.string().min(1, "Duration is required"),
  year: z
    .number()
    .int()
    .min(1888)
    .max(new Date().getFullYear() + 1),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const updateEntrySchema = createEntrySchema.partial();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
