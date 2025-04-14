import { arktypeValidator } from "@hono/arktype-validator";

import { getPostsOfUser } from "@/data-access/posts";
import { getUserInfo } from "@/data-access/users";
import { createRouter } from "@/lib/create-app";
import { paginationSchema } from "@/lib/schemas";
import { tryCatch } from "@/lib/utils";

const router = createRouter();

router.get("/:userId", async (c) => {
  const userId = c.req.param("userId");

  const [user, error] = await tryCatch(getUserInfo({ userId }));

  if (error) {
    return c.json({ message: "Internal server error" }, 500);
  }

  if (!user) {
    return c.json({ success: false, message: "User not found" });
  }

  return c.json({ success: true, data: user });
});

router.get("/:userId/posts", arktypeValidator("query", paginationSchema), async (c) => {
  const userId = c.req.param("userId");
  const { page, perPage } = c.req.valid("query");

  const [posts, error] = await tryCatch(getPostsOfUser({ userId, page, perPage }));

  if (error) {
    return c.json({ message: "Internal server error" }, 500);
  }

  return c.json({ success: true, data: posts });
});

export default router;
