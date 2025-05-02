import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );

    console.log("MongoDb Connected", connection.connection.host);
  } catch (error) {
    console.log("MongoDB Error", error);
    process.exit(1);
  }
};


export default connectDB