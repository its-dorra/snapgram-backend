import { relations } from "drizzle-orm";
import { primaryKey, text } from "drizzle-orm/pg-core";

import { users } from "@/db/schema/auth-schema";
import { tableCreator } from "@/db/table-creator";

export const followTable = tableCreator("follow", {
  userId: text("user_id").notNull().references(() => users.id),
  followedBy: text("followed_by").notNull().references(() => users.id),
}, t => [
  primaryKey({ columns: [t.userId, t.followedBy] }),
]);

export const followRelations = relations(followTable, ({ one }) => ({
  user: one(users, {
    fields: [followTable.userId],
    references: [users.id],
    relationName: "followings",
  }),
  followedBy: one(users, {
    fields: [followTable.followedBy],
    references: [users.id],
    relationName: "followers",
  }),
}));
