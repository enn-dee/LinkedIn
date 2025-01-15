import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connected ${con}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
