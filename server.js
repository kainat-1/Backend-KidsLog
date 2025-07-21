import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./Routes/auth.js";
import activitiesRoutes from "./Routes/Activity.js";


dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL, 
}));
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/activities", activitiesRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)  
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });
