import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [
    {
      description: { type: String },
      duration: { type: Number },
      date: { type: Date },
    },
  ],
});

export default mongoose.model("User", userSchema);
