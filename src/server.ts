import express from "express";
import { connectDB } from "./db";
import dotenv from "dotenv";
import { logger } from "./Middleware/logger";

dotenv.config();

const app = express();
app.use(express.json());

app.use(logger);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
