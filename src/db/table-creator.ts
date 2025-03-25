import { pgTableCreator } from "drizzle-orm/pg-core/table";

export const tableCreator = pgTableCreator(name => `snapgram-${name}`);
