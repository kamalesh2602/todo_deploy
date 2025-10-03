import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!global._mongooseConnection) {
  global._mongooseConnection = mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default global._mongooseConnection;
