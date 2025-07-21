import mongoose, { Schema } from "mongoose";

const activitySchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    enum: ["inprocess", "done", "later"],
    default: "inprocess"
  },
  kid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kid"
  }
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
