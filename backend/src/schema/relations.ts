import { relations } from "drizzle-orm";
import { User } from "./user.schema";
import { Category } from "./category.schema";
import { Todo } from "./todo.schema";

export const userRelations = relations(User, ({ many }) => ({
  categories: many(Category),
  todos: many(Todo),
}));

export const categoryRelations = relations(Category, ({ one, many }) => ({
  user: one(User, {
    fields: [Category.userId],
    references: [User.id],
  }),
  todos: many(Todo),
}));

export const todoRelations = relations(Todo, ({ one }) => ({
  user: one(User, {
    fields: [Todo.userId],
    references: [User.id],
  }),
  category: one(Category, {
    fields: [Todo.categoryId],
    references: [Category.id],
  }),
}));
