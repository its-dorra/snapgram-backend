import { date, serial, text } from "drizzle-orm/pg-core";

import { tableCreator } from "@/db";

export const postTable = tableCreator("posts", {
  id: serial("id").primaryKey(),
  imageUrl: text("imageUrl").notNull(),
  // userId: serial("userId"),
  createdAt: date("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: date("updated_at", { mode: "date" }).notNull().defaultNow().$onUpdate(() => new Date()),
});
