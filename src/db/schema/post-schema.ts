import { relations } from "drizzle-orm";
import { date, index, integer, text, uuid } from "drizzle-orm/pg-core";

import { users } from "@/db/schema/auth-schema";
import { likesTable } from "@/db/schema/like-schema";
import { savedTable } from "@/db/schema/saved-schema";
import { tableCreator } from "@/db/table-creator";

export const postTable = tableCreator("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageUrl: text("image_url").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  caption: text("caption").notNull(),
  location: text("location").notNull(),
  tags: text("tags").notNull(),
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: date("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: date("updated_at", { mode: "date" }).notNull().defaultNow().$onUpdate(() => new Date()),
}, t => ({
  userIdx: index("post_user_idx").on(t.userId),
}));

export const postRelations = relations(postTable, ({ one, many }) => ({
  user: one(users, {
    fields: [postTable.userId],
    references: [users.id],
  }),
  likes: many(likesTable),
  saveds: many(savedTable),
}));
