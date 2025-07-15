import { Schema, model } from "mongoose";

const activitySchema = new Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  kid: { type: Schema.Types.ObjectId, ref: "Kid", required: true },
});

const Activity = model("Activity", activitySchema);
export default Activity;
