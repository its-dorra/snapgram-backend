import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(10),
  PORT: z.coerce.number().catch(3000),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_URL: z.string().url(),
});

// eslint-disable-next-line node/no-process-env
const env = envSchema.parse(process.env);

export default env;
