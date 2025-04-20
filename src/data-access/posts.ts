import { and, count, desc, eq, or } from "drizzle-orm";

import db from "@/db";
import { followTable, likesTable, postTable, savedTable, users } from "@/db/schema";

export async function getUserFeed({ userId, page, perPage }: { page: number; perPage: number; userId: string }) {
  const postsQuery = db
    .select({
      post: postTable,
      likes: {
        userId: likesTable.userId,
      },
      saved: {
        userId: savedTable.userId,
      },
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(postTable)
    .innerJoin(users, eq(users.id, postTable.userId))
    .leftJoin(followTable, eq(postTable.userId, followTable.userId))
    .leftJoin(likesTable, and(eq(likesTable.postId, postTable.id), eq(likesTable.userId, userId)))
    .leftJoin(savedTable, and(eq(savedTable.postId, postTable.id), eq(savedTable.userId, userId)))
    .where(or(eq(followTable.followedBy, userId), eq(postTable.userId, userId)))
    .limit(perPage)
    .offset((page - 1) * perPage)
    .orderBy(desc(postTable.createdAt));

  const countQuery = db
    .select({ totalCount: count() })
    .from(postTable)
    .leftJoin(followTable, eq(postTable.userId, followTable.userId))
    .where(or(eq(followTable.followedBy, userId),eq(postTable.userId, userId)));

  const [posts, [{ totalCount }]] = await Promise.all([
    postsQuery,  
    countQuery,
  ]);

  await new Promise(res => setTimeout(res, 1000)); // Simulate a delay

  return {
    posts: posts.map(post => ({
      ...post.post,
      user: post.user,
      isLikedByCurrentUser: !!post.likes,
      isSavedByCurrentUser: !!post.saved,
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
      saved: {
        userId: savedTable.userId,
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
    .leftJoin(savedTable, and(eq(savedTable.postId, postTable.id), eq(savedTable.userId, userId)))
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
      isSavedByCurrentUser: !!post.saved,
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
        saveds: {
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
    isSavedByCurrentUser: post.saveds.length === 1,
  };
}

export function createPost({ userId, caption, imageUrl, location, tags }: typeof postTable.$inferInsert) {
  return db.insert(postTable).values({ userId, caption, imageUrl, location, tags }).returning();
}

export function editPost({ caption, location, tags, id, userId }: Partial<typeof postTable.$inferInsert> & { id: string ;userId: string }) {
  return db.update(postTable).set({ caption, location, tags }).where(and(eq(postTable.id, id), eq(postTable.userId, userId))).returning().then(res => res?.[0]);
}
