import { pgTable, text, timestamp, unique, boolean, integer, foreignKey, index, uuid, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const snapgramVerifications = pgTable("snapgram-verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const snapgramUsers = pgTable("snapgram-users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	bio: text(),
	followersCount: integer("followers_count").default(0),
	followingsCount: integer("followings_count").default(0),
}, (table) => [
	unique("snapgram-users_email_unique").on(table.email),
]);

export const snapgramAccounts = pgTable("snapgram-accounts", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [snapgramUsers.id],
			name: "snapgram-accounts_user_id_snapgram-users_id_fk"
		}).onDelete("cascade"),
]);

export const snapgramSessions = pgTable("snapgram-sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [snapgramUsers.id],
			name: "snapgram-sessions_user_id_snapgram-users_id_fk"
		}).onDelete("cascade"),
	unique("snapgram-sessions_token_unique").on(table.token),
]);

export const snapgramPosts = pgTable("snapgram-posts", {
	postId: uuid("post_id").defaultRandom().primaryKey().notNull(),
	imageUrl: text("image_url").notNull(),
	userId: text("user_id").notNull(),
	createdAt: date("created_at").defaultNow().notNull(),
	location: text().notNull(),
	tags: text().notNull(),
	updatedAt: date("updated_at").defaultNow().notNull(),
	likesCount: integer("likes_count").default(0).notNull(),
	caption: text().notNull(),
}, (table) => [
	index("post_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [snapgramUsers.id],
			name: "snapgram-posts_user_id_snapgram-users_id_fk"
		}),
]);

export const snapgramFollow = pgTable("snapgram-follow", {
	userId: text("user_id").notNull(),
	followedBy: text("followed_by").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [snapgramUsers.id],
			name: "snapgram-follow_user_id_snapgram-users_id_fk"
		}),
	foreignKey({
			columns: [table.followedBy],
			foreignColumns: [snapgramUsers.id],
			name: "snapgram-follow_followed_by_snapgram-users_id_fk"
		}),
	primaryKey({ columns: [table.userId, table.followedBy], name: "snapgram-follow_user_id_followed_by_pk"}),
]);

export const snapgramLikes = pgTable("snapgram-likes", {
	userId: text("user_id").notNull(),
	postId: uuid("post_id").notNull(),
	createdAt: date("created_at").defaultNow().notNull(),
	updatedAt: date("updated_at").defaultNow().notNull(),
}, (table) => [
	index("like_post_idx").using("btree", table.postId.asc().nullsLast().op("uuid_ops")),
	index("like_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [snapgramUsers.id],
			name: "snapgram-likes_user_id_snapgram-users_id_fk"
		}),
	foreignKey({
			columns: [table.postId],
			foreignColumns: [snapgramPosts.postId],
			name: "snapgram-likes_post_id_snapgram-posts_post_id_fk"
		}),
	primaryKey({ columns: [table.userId, table.postId], name: "snapgram-likes_post_id_user_id_pk"}),
]);

export const snapgramSaved = pgTable("snapgram-saved", {
	userId: text("user_id").notNull(),
	postId: uuid("post_id").notNull(),
	createdAt: date("created_at").defaultNow().notNull(),
	updatedAt: date("updated_at").defaultNow().notNull(),
}, (table) => [
	index("saved_post_idx").using("btree", table.postId.asc().nullsLast().op("uuid_ops")),
	index("saved_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [snapgramUsers.id],
			name: "snapgram-saved_user_id_snapgram-users_id_fk"
		}),
	foreignKey({
			columns: [table.postId],
			foreignColumns: [snapgramPosts.postId],
			name: "snapgram-saved_post_id_snapgram-posts_post_id_fk"
		}),
	primaryKey({ columns: [table.userId, table.postId], name: "snapgram-saved_post_id_user_id_pk"}),
]);
