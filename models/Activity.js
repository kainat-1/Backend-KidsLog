import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  task: String,
});

const ActivityModel = mongoose.model("todo", ActivitySchema);

module.exports = ActivityModel;
