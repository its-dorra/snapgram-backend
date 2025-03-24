import { relations } from "drizzle-orm";
import { date, index, primaryKey, text, uuid } from "drizzle-orm/pg-core";

import { users } from "@/db/schema/auth-schema";
import { postTable } from "@/db/schema/post-schema";
import { tableCreator } from "@/db/table-creator";

export const likeTable = tableCreator("likes", {
  userId: text("user_id").notNull().references(() => users.id),
  postId: uuid("post_id").references(() => postTable.id),
  createdAt: date("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: date("updated_at", { mode: "date" }).notNull().defaultNow().$onUpdate(() => new Date()),
}, t => ({
  userIdx: index("like_user_idx").on(t.userId),
  postIdx: index("like_post_idx").on(t.postId),
  likePrimaryKey: primaryKey({ columns: [t.postId, t.userId] }),
}));

export const likeRelations = relations(likeTable, ({ one }) => ({
  post: one(postTable, {
    fields: [likeTable.postId],
    references: [postTable.id],
  }),
  user: one(users, {
    fields: [likeTable.userId],
    references: [users.id],
  }),
}));
