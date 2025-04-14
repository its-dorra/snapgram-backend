import { relations } from "drizzle-orm";
import { boolean, integer, text, timestamp } from "drizzle-orm/pg-core";

import { followTable } from "@/db/schema/follow-schema";
import { likesTable } from "@/db/schema/like-schema";
import { postTable } from "@/db/schema/post-schema";
import { savedTable } from "@/db/schema/saved-schema";
import { tableCreator } from "@/db/table-creator";

export const users = tableCreator("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  bio: text("bio"),
  followersCount: integer("followers_count").notNull().default(0),
  followingsCount: integer("followings_count").notNull().default(0),
  postsCount: integer("posts_count").notNull().default(0),
});

export const sessions = tableCreator("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = tableCreator("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = tableCreator("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const userRelations = relations(users, ({ many }) => ({
  posts: many(postTable),
  likes: many(likesTable),
  savedPosts: many(savedTable),
  followers: many(followTable, { relationName: "followers" }),
  followings: many(followTable, { relationName: "followings" }),
}));
