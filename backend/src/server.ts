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

const clientUrls = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || clientUrls.includes(requestOrigin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy rejection for origin: ${requestOrigin}`));
      }
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
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
