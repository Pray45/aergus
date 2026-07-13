import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 3000;
const origin = process.env.NODE_ENV == "development" ? "*" : "https://aergus.vercel.app"
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin }));

app.get("/health", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.use("/api/auth", (await import("./user/userRoutes.js")).default);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});