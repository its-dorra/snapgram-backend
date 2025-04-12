import { relations } from "drizzle-orm/relations";
import { snapgramUsers, snapgramAccounts, snapgramSessions, snapgramPosts, snapgramFollow, snapgramLikes, snapgramSaved } from "./schema";

export const snapgramAccountsRelations = relations(snapgramAccounts, ({one}) => ({
	snapgramUser: one(snapgramUsers, {
		fields: [snapgramAccounts.userId],
		references: [snapgramUsers.id]
	}),
}));

export const snapgramUsersRelations = relations(snapgramUsers, ({many}) => ({
	snapgramAccounts: many(snapgramAccounts),
	snapgramSessions: many(snapgramSessions),
	snapgramPosts: many(snapgramPosts),
	snapgramFollows_userId: many(snapgramFollow, {
		relationName: "snapgramFollow_userId_snapgramUsers_id"
	}),
	snapgramFollows_followedBy: many(snapgramFollow, {
		relationName: "snapgramFollow_followedBy_snapgramUsers_id"
	}),
	snapgramLikes: many(snapgramLikes),
	snapgramSaveds: many(snapgramSaved),
}));

export const snapgramSessionsRelations = relations(snapgramSessions, ({one}) => ({
	snapgramUser: one(snapgramUsers, {
		fields: [snapgramSessions.userId],
		references: [snapgramUsers.id]
	}),
}));

export const snapgramPostsRelations = relations(snapgramPosts, ({one, many}) => ({
	snapgramUser: one(snapgramUsers, {
		fields: [snapgramPosts.userId],
		references: [snapgramUsers.id]
	}),
	snapgramLikes: many(snapgramLikes),
	snapgramSaveds: many(snapgramSaved),
}));

export const snapgramFollowRelations = relations(snapgramFollow, ({one}) => ({
	snapgramUser_userId: one(snapgramUsers, {
		fields: [snapgramFollow.userId],
		references: [snapgramUsers.id],
		relationName: "snapgramFollow_userId_snapgramUsers_id"
	}),
	snapgramUser_followedBy: one(snapgramUsers, {
		fields: [snapgramFollow.followedBy],
		references: [snapgramUsers.id],
		relationName: "snapgramFollow_followedBy_snapgramUsers_id"
	}),
}));

export const snapgramLikesRelations = relations(snapgramLikes, ({one}) => ({
	snapgramUser: one(snapgramUsers, {
		fields: [snapgramLikes.userId],
		references: [snapgramUsers.id]
	}),
	snapgramPost: one(snapgramPosts, {
		fields: [snapgramLikes.postId],
		references: [snapgramPosts.postId]
	}),
}));

export const snapgramSavedRelations = relations(snapgramSaved, ({one}) => ({
	snapgramUser: one(snapgramUsers, {
		fields: [snapgramSaved.userId],
		references: [snapgramUsers.id]
	}),
	snapgramPost: one(snapgramPosts, {
		fields: [snapgramSaved.postId],
		references: [snapgramPosts.postId]
	}),
}));