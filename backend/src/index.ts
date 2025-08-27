import express from "express";
import userRouter from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import cors from "cors"

dotenv.config({ path: ".env" })

const BACKEND_PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
  origin: ["http://localhost:8080"], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRouter);

app.listen(BACKEND_PORT, () => {
  console.log(`Server running on http://localhost:${BACKEND_PORT}`);
});