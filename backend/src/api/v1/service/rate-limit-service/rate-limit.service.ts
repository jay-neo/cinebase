import rateLimit from "express-rate-limit";

/**
 * Rate limiter for movie creation
 * Allows 5 requests per minute, blocks for 1 minute after limit exceeded
 */
export const movieCreationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per window
  message: {
    error: "Too many movies created. Please try again after 1 minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use IP address for identification
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || "unknown";
  },
  // Custom handler to return proper response
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many movies created. Please try again after 1 minute.",
      retryAfter: 60,
    });
  },
});

