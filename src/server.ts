import express from "express";
import cors from "cors"
import { connectDB } from "./db";
import dotenv from "dotenv";
import { logger } from "./Middleware/logger";
import userRoutes from "./routes/userRoutes";
import userRoutes2 from './routes/userroutes2'


dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.use(logger);
app.use("/api/users", userRoutes);
app.use("/api/users2", userRoutes2);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
