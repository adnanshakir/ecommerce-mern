import dotenv from "dotenv";
dotenv.config();

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NODE_ENV",
  "IMAGEKIT_PVT_KEY",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is not set.`);
  }
});

export const config = Object.fromEntries(
  requiredEnv.map((key) => [key, process.env[key]])
);