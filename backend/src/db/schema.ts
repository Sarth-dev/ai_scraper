import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  question: text("question").notNull(),
  status: text("status").notNull(), // pending | processing | done | failed
  answer: text("answer"),
  createdAt: timestamp("created_at").defaultNow()
});
