import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

// Enable trust proxy for cloud reverse proxies (e.g. Render, Railway, Vercel)
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

const defaultOrigins = [
  "http://localhost:3000",
  "https://aergus.vercel.app",
];

const envOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim().replace(/\/$/, ""))
  : [];

const allowedOrigins = Array.from(
  new Set([...defaultOrigins, ...envOrigins]),
);

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin) return callback(null, true);
      const normalized = requestOrigin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.use("/api/auth", (await import("./user/userRoutes.js")).default);

app.use("/api/workspace", (await import("./workspace/workspaceRoutes.js")).default);

app.use("/api/project", (await import("./project/projectRoutes.js")).default);

app.use("/api/resource", (await import("./resources/resourceRoutes.js")).default);

// Global Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Error Handler:", err);
  const status = err.statusCode || err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
