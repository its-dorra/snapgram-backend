import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(10),
});

// eslint-disable-next-line node/no-process-env
const env = envSchema.parse(process.env);

export default env;
