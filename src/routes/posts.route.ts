import { arktypeValidator } from "@hono/arktype-validator";

import { createPost, editPost, getPostById, getUserFeed } from "@/data-access/posts";
import { uploadImage } from "@/lib/cloudinary";
import { createRouter } from "@/lib/create-app";
import { createPostSchema, editPostSchema, paginationSchema, postParamSchema } from "@/lib/schemas";
import { tryCatch } from "@/lib/utils";

const router = createRouter();

router.get("/feed", arktypeValidator("query", paginationSchema), async (c) => {
  const { id: userId } = c.var.user;
  const { page, perPage } = c.req.valid("query");

  const [posts, error] = await tryCatch(getUserFeed({ userId, page: +page, perPage: +perPage }));
  if (error) {
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
  return c.json({ success: true, data: posts });
});

router.get("/:postId", arktypeValidator("param", postParamSchema), async (c) => {
  const { postId } = c.req.valid("param");
  const { id: userId } = c.var.user;
  const [post, error] = await tryCatch(getPostById({ postId, userId }));

  if (error) {
    return c.json({ success: false, message: "Internal server error" }, 500);
  }

  if (!post) {
    return c.json({ success: false, message: "Post not found" }, 404);
  }
  return c.json({ success: true, data: post });
});

router.post("/", arktypeValidator("form", createPostSchema), async (c) => {
  const { id: userId } = c.var.user;

  const { caption, image, location, tags } = c.req.valid("form");

  const [imageUrl, errorUpload] = await tryCatch(uploadImage(image));

  if (errorUpload) {
    return c.json({ success: false, message: "Internal server error" }, 500);
  }

  const [post, error] = await tryCatch(createPost({ imageUrl, caption, location, tags, userId }));

  if (error) {
    return c.json({ success: false, message: "Internal server error" }, 500);
  }

  return c.json({ success: true, data: post });
});

router.patch("/:postId", arktypeValidator("form", editPostSchema), arktypeValidator('param',postParamSchema) , async (c) => {
  const {id : userId} = c.var.user;
  const { postId } = c.req.valid("param");
  const data = c.req.valid("form");
  
  const [post,error] = await tryCatch(editPost({...data, id: postId, userId}));

  if (error) {
    return c.json({ success: false, message: "Internal server error" }, 500);
  }

  if (!post) {
    return c.json({ success: false, message: "Post not found" }, 404);
  }

  return c.json({ success: true, data: post });
});

export default router;
