import { handle } from "hono/vercel";

import { createApp } from "@/lib/create-app";

export const config = {
  runtime: "edge",
};

const app = createApp();

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

export default handle(app);
