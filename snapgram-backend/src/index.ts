import { auth } from "@/lib/auth";
import { createApp } from "@/lib/create-app";

const app = createApp();

app.on(["POST", "GET"], "/auth/**", c => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
Bun.serve({
  fetch: app.fetch,
  port: 3000,
});
