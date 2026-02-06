import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { Category } from "./category.schema";
import { User } from "./user.schema";

export const Todo = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
  dueDate: timestamp("due_date", {
    mode: "date",
    withTimezone: true,
  }),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  priority: varchar("priority", { length: 50 })
    .$type<"low" | "medium" | "high">()
    .default("medium")
    .notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => Category.id, { onDelete: "cascade" }),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
