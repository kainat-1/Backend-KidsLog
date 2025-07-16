import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ActivityModel from '/model/Activity.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/test')
app.post("/add", (req, res) => {
  const task = req.body.task;

});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
