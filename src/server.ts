import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import dotenv from "dotenv";
import { logger } from "./Middleware/logger";
import userRoutes from "./routes/userRoutes";


dotenv.config();


const app = express();

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.use(logger);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
