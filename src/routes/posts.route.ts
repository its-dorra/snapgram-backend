import { arktypeValidator } from "@hono/arktype-validator";

import { getPostById, getUserFeed } from "@/data-access/posts";
import { createRouter } from "@/lib/create-app";
import { createPostSchema, editPostSchema, feedQuerySchema, postParamSchema } from "@/lib/schemas";

const router = createRouter();

router.get("/feed", arktypeValidator("query", feedQuerySchema), async (c) => {
  const { id: userId } = c.var.user;
  const { page, perPage } = c.req.valid("query");

  const posts = await getUserFeed({ userId, page: +page, perPage: +perPage });
  return c.json({ success: true, data: posts });
});

router.get("/:postId", arktypeValidator("param", postParamSchema), async (c) => {
  const { postId } = c.req.valid("param");
  const { id: userId } = c.var.user;
  const post = await getPostById({ postId, userId });

  if (!post) {
    return c.json({ success: false, message: "Post not found" }, 404);
  }
  return c.json({ success: true, data: post });
});

router.post("/", arktypeValidator("form", createPostSchema), async (c) => {
  const data = c.req.valid("form");

  console.log(data);

  return c.json(data);
});

router.patch("/:postId", arktypeValidator("form", editPostSchema), async (c) => {
  const data = c.req.valid("form");
  console.log(data);
  return c.json(data);
});

export default router;
