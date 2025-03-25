import { Hono } from "hono";
import { cors } from "hono/cors";

import type { AppBindings } from "./types";

export function createRouter() {
  return new Hono<AppBindings>({ strict: false });
}

export function createApp() {
  const app = createRouter().basePath("/api");

  app.use("*", cors({
    origin: "http://localhost:3001",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }));

  return app;
}
