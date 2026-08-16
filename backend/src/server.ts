import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 5000;
const origin = process.env.CLIENT_URL || "http://localhost:3000";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin,
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
