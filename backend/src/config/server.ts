import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import * as express from "express";
import helmet from "helmet";
import morgan from "morgan";
import logger from "../api/v1/config/logger";
import routes from "../api/v1/route";
import { env } from "./env";
import { meta } from "../api/v1/config/meta";

const api = "/api/v1";

export default (app: express.Application) => {
	// Global error handlers
	process.on("uncaughtException", (error) => {
		logger.error("Uncaught Exception:", error);
	});

	process.on("unhandledRejection", (reason) => {
		logger.error("Unhandled Rejection:", reason);
	});

	app.enable("trust proxy");

	// CORS Configuration (ONLY ONE!)
	app.use(
		cors({
			origin: (origin, callback) => {
				// Allow requests with no origin (Postman, mobile, etc.)
				if (!origin || env.clients.includes(origin)) {
					callback(null, true);
				} else {
					logger.warn(`CORS blocked origin: ${origin}`);
					callback(new Error("Not allowed by CORS"));
				}
			},
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			exposedHeaders: ["Authorization", "X-Total-Count"],
			optionsSuccessStatus: 200,
			preflightContinue: false,
		})
	);

	// Body parsers
	app.use(
		bodyParser.urlencoded({
			extended: true,
			limit: "5mb",
			type: "application/x-www-form-urlencoded",
		})
	);

	app.use(
		bodyParser.json({
			limit: "10mb",
			strict: true,
			type: "application/json",
		})
	);

	// Other middlewares
	app.use(morgan("dev"));
	app.use(helmet());
	app.use(compression());
	app.use(express.static("public"));
	app.disable("x-powered-by");

	// API routes
	app.use(api, routes);

	// Root endpoint
	app.get("/", (_req: Request, res: Response) => {
		res.status(200).json({
			message: `Hi from ${meta.appName}`,
		});
	});

	// 404 handler
	app.use((_req: Request, _res: Response, next: NextFunction) => {
		const error = new Error("Endpoint not found");
		(error as any).status = 404;
		next(error);
	});

	// Global error handler
	app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
		if (error.type === "entity.too.large") {
			return res.status(413).json({ error: "Request body too large" });
		}

		const status = error.status || 500;
		const message = status === 500 ? "Internal Server Error" : error.message;

		logger.error(`[${status}] ${message}`, { error });

		res.status(status).json({
			error: message,
		});
	});
}