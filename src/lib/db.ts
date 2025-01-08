import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env"
  );
}

declare global {
  var mongooseConnection: Promise<typeof mongoose> | null;
}

let cached = global.mongooseConnection;

if (!cached) {
  cached = null;
}

async function dbConnect() {
  if (cached) {
    // If the connection is cached, return it
    return cached;
  }

  // If not, create a new connection
  mongoose.set("strictQuery", false); // Optional: Suppress deprecation warnings

  // Event listeners for debugging
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB");
  });
  mongoose.connection.on("error", (err) => {
    console.error(`Mongoose connection error: ${err}`);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from DB");
  });

  cached = mongoose.connect(MONGODB_URI);
  global.mongooseConnection = cached;
  return cached;
}

export default dbConnect;
