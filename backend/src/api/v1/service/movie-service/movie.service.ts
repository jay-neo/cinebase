import { NextFunction, Request, Response } from "express";
import { db } from "../../lib/db";

import {
  createEntrySchema,
  updateEntrySchema,
  paginationSchema,
} from "./movie.schema";

class MovieService {
  public createEntry = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized access: User ID not found" });
    }
    const data = createEntrySchema.parse(req.body);
    const entry = await db.entry.create({ data: { userId, ...data } });
    res.status(201).json(entry);
  };

  public getAllEntries = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized access: User ID not found" });
    }

    const { page, limit } = paginationSchema.parse(req.query);
    const skip = (page - 1) * limit;

    const [entries, totalCount] = await Promise.all([
      db.entry.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.entry.count({ where: { userId } }),
    ]);

    res.json({
      entries,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  };

  public getEntryById = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized access: User ID not found" });
    }

    const { id } = req.params;
    const entry = await db.entry.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json(entry);
  };

  public updateEntry = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized access: User ID not found" });
    }

    const { id } = req.params;
    const data = updateEntrySchema.parse(req.body);

    // Check if entry exists and belongs to user
    const existingEntry = await db.entry.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!existingEntry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    const entry = await db.entry.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json(entry);
  };

  public deleteEntry = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized access: User ID not found" });
    }

    const { id } = req.params;

    // Check if entry exists and belongs to user
    const existingEntry = await db.entry.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!existingEntry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    await db.entry.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  };
}

export const movieService = new MovieService();
