import type { auth } from "./auth";

export interface AppBindings {
  Variables: {
    user: typeof auth.$Infer.Session.user;
  };
}
