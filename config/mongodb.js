import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // mongoose.set("useCreateIndex", true);
    console.log(`MognoDB appempt to connect`);

    var conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log(`MognoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
