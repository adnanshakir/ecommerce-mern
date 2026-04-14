import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MongoDB URI is not set.");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT secret is not set.");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Google Client ID is not set.");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google Client Secret is not set.");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
