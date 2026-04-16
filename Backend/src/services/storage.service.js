import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PVT_KEY,
});

export async function uploadFile({buffer, fileName, folder = "E-commerce"}) {
  try {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder,
    });

    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}