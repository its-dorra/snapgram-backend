import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import env from "@/lib/env";

import * as schema from "./schema";

;

// const sql = neon(env.DATABASE_URL);

const sql = new Pool({
  connectionString: env.DATABASE_URL,
});
const db = drizzle({ client: sql, schema });

export default db;
