import usersRouter from "@/routes/users.route";

import { auth } from "@/lib/auth";
import { createApp } from "@/lib/create-app";
import env from "@/lib/env";
import postsRouter from "@/routes/posts.route";

const app = createApp();

app.on(["POST", "GET"], "/auth/*", c => auth.handler(c.req.raw),
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("user", session.user);

  return await next();
});

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

app.route("/posts", postsRouter);
app.route("/users", usersRouter);

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
Bun.serve({
  fetch: app.fetch,
  port: env.PORT,
});
