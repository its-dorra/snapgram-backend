import { type } from "arktype";

export const createPostSchema = type({
  caption: "string >= 3",
  image: "File",
  tags: "string >= 3",
  location: "string >= 3",
});

export const editPostSchema = createPostSchema.omit('image').partial();

// TODO: add validation for postId

export const postParamSchema = type({
  postId: "string",
});



export const paginationSchema = type({
  page: 'string.integer.parse',
  perPage: "string.integer.parse",
});
