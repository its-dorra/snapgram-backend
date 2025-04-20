import { count, eq } from "drizzle-orm";

import db from "@/db";
import { likesTable, postTable, savedTable } from "@/db/schema";

export function getUserInfo({ userId }: { userId: string }) {
  return db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, userId),
    columns: {
      email: false,
      emailVerified: false,
      createdAt: false,
      updatedAt: false,
    },
  });
}

export async function getUserLikedPosts({ userId, page, perPage }: { userId: string ; page: number;perPage: number }) {
  const likedPostsQuery = db
    .select({ post: postTable, saved: savedTable })
    .from(likesTable)
    .innerJoin(postTable, eq(likesTable.postId, postTable.id))
    .leftJoin(savedTable, eq(savedTable.userId, userId))
    .where(eq(likesTable.userId, userId))
    .limit(perPage)
    .offset((page - 1) * perPage);

  const totalCountQuery = db.select({ totalCount: count() }).from(likesTable).innerJoin(postTable, eq(likesTable.postId, postTable.id)).where(eq(likesTable.userId, userId)).then(res => res[0].totalCount);

  const [likedPosts, totalCount] = await Promise.all([
    likedPostsQuery,
    totalCountQuery,
  ]);

  return {
    posts: likedPosts.map(item => ({ ...item.post, isSavedByCurrentUser: item.saved !== null })),
    pagination: {
      page,
      perPage,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
      hasNextPage: totalCount > page * perPage,
    },
  };
}
