import { accounts, sessions, userRelations, users, verifications } from "./auth-schema";
import { likeRelations, likeTable } from "./like-schema";
import { postRelations, postTable } from "./post-schema";
import { savedRelations, savedTable } from "./saved-schema";

export {
  accounts,
  likeRelations,
  likeTable,
  postRelations,
  postTable,
  savedRelations,
  savedTable,
  sessions,
  userRelations,
  users,
  verifications,
};
