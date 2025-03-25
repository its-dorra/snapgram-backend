import { relations } from "drizzle-orm";
import { bigint, date, index, text, uuid } from "drizzle-orm/pg-core";

import { users } from "@/db/schema/auth-schema";
import { likeTable } from "@/db/schema/like-schema";
import { tableCreator } from "@/db/table-creator";

export const postTable = tableCreator("posts", {
  id: uuid("post_id").primaryKey().defaultRandom(),
  imageUrl: text("imageUrl").notNull(),
  userId: text("userId").notNull().references(() => users.id),
  createdAt: date("created_at", { mode: "date" }).notNull().defaultNow(),
  location: text("location").notNull(),
  tags: text("tags").notNull(),
  updatedAt: date("updated_at", { mode: "date" }).notNull().defaultNow().$onUpdate(() => new Date()),
  likesCount: bigint({
    mode: "number",
  }).notNull().default(0),
}, t => ({
  userIdx: index("post_user_idx").on(t.userId),
}));

export const postRelations = relations(postTable, ({ one, many }) => ({
  user: one(users, {
    fields: [postTable.userId],
    references: [users.id],
  }),
  likes: many(likeTable),
}));
