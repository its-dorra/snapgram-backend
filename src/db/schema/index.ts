import { accounts, sessions, userRelations, users, verifications } from "./auth-schema";
import { followRelations, followTable } from "./follow-schema";
import { likeRelations, likesTable } from "./like-schema";
import { postRelations, postTable } from "./post-schema";
import { savedRelations, savedTable } from "./saved-schema";

export {
  accounts,
  followRelations,
  followTable,
  likeRelations,
  likesTable,
  postRelations,
  postTable,
  savedRelations,
  savedTable,
  sessions,
  userRelations,
  users,
  verifications,
};
