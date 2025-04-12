import { type } from "arktype";

export const createPostSchema = type({
  caption: "string >= 3",
  image: "File",
  tags: "string >= 3",
  location: "string >= 3",
});

export const editPostSchema = createPostSchema.partial();

// TODO: add validation for postId

export const postParamSchema = type({
  postId: "string",
});



export const feedQuerySchema = type({
  page: 'string.integer',
  perPage: "string.integer",
});
