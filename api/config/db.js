import mongoose from "mongoose";
import "dotenv/config";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected");
  } catch (err) {
    console.error(err.message);
  }
};

export default connectDB;
