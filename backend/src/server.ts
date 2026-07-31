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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
