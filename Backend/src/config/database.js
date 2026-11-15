import mongoose from "mongoose";

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing required environment variable: MONGODB_URI");

  const cached = globalThis._mongoose ??= { conn: null, promise: null };
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;
  if (cached.conn && mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  cached.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 8000,
  });

  try {
    await cached.promise;
    cached.conn = mongoose.connection;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  const cached = globalThis._mongoose ??= { conn: null, promise: null };
  if (!cached.conn) return;

  try {
    await mongoose.disconnect();
  } finally {
    cached.conn = null;
    cached.promise = null;
  }
};

