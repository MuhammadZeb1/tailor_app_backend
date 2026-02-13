import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Modern Mongoose does not need the options object
    const conn = await mongoose.connect("mongodb://localhost:27017/tailorDB");
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};

export default connectDB;