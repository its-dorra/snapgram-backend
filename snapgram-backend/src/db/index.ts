import { drizzle } from "drizzle-orm/node-postgres";
import { pgTableCreator } from "drizzle-orm/pg-core/table";
import { Pool } from "pg";

import env from "@/lib/env";

// const sql = neon(env.DATABASE_URL);

const sql = new Pool({
  connectionString: env.DATABASE_URL,
});
const db = drizzle({ client: sql });

export const tableCreator = pgTableCreator(name => `snapgram-${name}`);

export default db;
