import { v2 as cloudinary } from "cloudinary";

import env from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File) {
  const imageData = await file.arrayBuffer();
  const mime = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(imageData).toString(encoding);
  const fileUri = `data:${mime};${encoding},${base64Data}`;
  const result = await cloudinary.uploader.upload(fileUri, {
    folder: "snapgram",
  });
  return result.secure_url;
}
