import { and, count, desc, eq } from "drizzle-orm";

import db from "@/db";
import { followTable, likesTable, postTable, users } from "@/db/schema";

export async function getUserFeed({ userId, page, perPage }: { page: number; perPage: number; userId: string }) {
  const postsQuery = db
    .select({
      post: postTable,
      likes: {
        userId: likesTable.userId,
      },
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(postTable)
    .leftJoin(followTable, eq(postTable.userId, followTable.userId))
    .innerJoin(users, eq(users.id, postTable.userId))
    .leftJoin(likesTable, and(eq(likesTable.postId, postTable.id), eq(likesTable.userId, userId)))
    .where(eq(followTable.followedBy, userId));

  const countQuery = db
    .select({ totalCount: count() })
    .from(postTable)
    .leftJoin(followTable, eq(postTable.userId, followTable.userId))
    .where(eq(followTable.followedBy, userId));

  const [posts, [{ totalCount }]] = await Promise.all([
    postsQuery
      .limit(perPage)
      .offset((page - 1) * perPage)
      .orderBy(desc(postTable.createdAt)),
    countQuery,
  ]);

  await new Promise(res => setTimeout(res, 1000)); // Simulate a delay

  return {
    posts: posts.map(post => ({
      ...post.post,
      user: post.user,
      isLikedByCurrentUser: !!post.likes,
    })),
    pagination: {
      page,
      perPage,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
      hasNextPage: totalCount > page * perPage,
    },
  };
}

export async function getPostsOfUser({ userId, page, perPage }: { page: number; perPage: number; userId: string }) {
  const postsQuery = db
    .select({
      post: postTable,
      likes: {
        userId: likesTable.userId,
      },
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(postTable)
    .innerJoin(users, eq(users.id, postTable.userId))
    .leftJoin(likesTable, and(eq(likesTable.postId, postTable.id), eq(likesTable.userId, userId)))
    .where(eq(postTable.userId, userId));

  const countQuery = db.$count(postsQuery);

  const [posts, totalCount] = await Promise.all([
    postsQuery
      .limit(perPage)
      .offset((page - 1) * perPage)
      .orderBy(desc(postTable.createdAt)),
    countQuery,
  ]);

  return {
    posts: posts.map(post => ({
      ...post.post,
      user: post.user,
      isLikedByCurrentUser: !!post.likes,
    })),
    pagination: {
      page,
      perPage,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
      hasNextPage: totalCount > page * perPage,
    },
  };
}
export async function getPostById({ postId, userId }: { postId: string; userId: string }) {
  const postQuery = db
    .query
    .postTable
    .findFirst({
      where: (t, { eq }) => eq(t.id, postId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: {
          columns: {
            userId: true,
          },
          where: (t, { eq, and }) => and(eq(t.userId, userId), eq(t.postId, postId)),
          limit: 1,
        },
      },
    });

  const post = await postQuery;

  if (!post)
    return null;

  return {
    ...post,
    isLikedByCurrentUser: post.likes.length === 1,
  };
}
